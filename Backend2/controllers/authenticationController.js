const userQueries = require('../Queries/userQueries');
const resetTokenQueries = require('../Queries/resetTokenQueries');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const ethers = require('ethers');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    let { fullName, email, password, role, walletAddress, companyName } = req.body;
    if (!email || !password || !role || !walletAddress) return res.status(400).json({ 'message': 'You need to provide all of the fields' });

    if (!fullName || typeof fullName !== "string" || fullName.trim() === "")
        return res.status(400).json({ message: "full name is required and must be a string" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (!ethers.isAddress(walletAddress.trim())) {
        throw new Error("Invalid Ethereum wallet address");
    }

    companyName = companyName.trim()
    if (!/^[a-zA-Z0-9\s&.,'-]{1,100}$/.test(companyName)) {
        return res.status(400).json({ message: 'Invalide company name' });
    }

    try {
        const userFound = await userQueries.getUserByEmail(email.toLowerCase());
        if (userFound) {
            return res.status(409).json({
                message: "This account is already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const addedUser = await userQueries.createUser({fullName, email, passwordHash, role, walletAddress, companyName});
        const user = {
            fullName: addedUser.full_name,
            email: addedUser.email
        }

        return res.status(201).json({ user: user })
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: error.message });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'You need to provide both the password and the email' });

    const foundedUser = await userQueries.getUserByEmail(email.toLowerCase());
    if (!foundedUser) res.status(401).json({ message: "Invalid email or password" });

    const isPwdMatch = await bcrypt.compare(password, foundedUser.passwordHash);
    if (isPwdMatch) {
        const accessToken = jwt.sign(
            {
                userInfo: {
                    id: foundedUser.id_user,
                    email: foundedUser.email,
                    role: foundedUser.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        const user = {
            id_user: foundedUser.id_user,
            email: foundedUser.email,
            role: foundedUser.role
        }

        return res.status(200).json({ success: true, accessToken, user: user });
    } else {
        console.error("Error in requestPasswordReset:", error);
        return res.status(404).json({ error: "User not found or not allowed" });
    }
}

const handleResetRequest = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await userQueries.getUserByEmail(email);
        if (!user) {
            return res.status(200).json({ message: "If this email exists, a reset link will be sent." });
        }

        const resetToken = uuid();
        const expirationDate = new Date(Date.now() + 60 * 60 * 1000);

        await resetTokenQueries.insertToken(user.id_user, resetToken, expirationDate);

        const resetLink = `http://localhost:1573/reset/reset-password/${resetToken}`;

        await sendEmail({
            to: email,
            subject: "Password Reset Request",
            html: `<!-- Header -->
                    <h2 style="text-align:center;color:#1e40af;margin-bottom:20px;">Password Reset Request</h2>

                    <!-- Body -->
                    <p style="font-size:16px;color:#111827;">Hello,</p>

                    <p style="font-size:15px;color:#374151;line-height:1.6;">
                    We received a request to reset your password for your <strong>ARTWARE Club</strong> account.
                    To proceed, please click the button below to set a new password:
                    </p>

                    <!-- Reset Button -->
                    <div style="text-align:center;margin:25px 0;">
                    <a href="${resetLink}" style="background:#1e40af;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:5px;font-weight:bold;display:inline-block;">
                        Reset Password
                    </a>
                    </div>

                    <p style="font-size:14px;color:#6b7280;line-height:1.6;">
                    Or copy and paste this link into your browser:<br/>
                    <a href="${resetLink}" style="color:#1e40af;word-break:break-all;">${resetLink}</a>
                    </p>`,
            /* attachments: [
                {
                    filename: "Tracability.png",
                    path: path.join(__dirname, "../utils/Tracability.png"),
                    cid: "Tracability",
                },
            ], */
        });

        return res.status(200).json({ message: "If this email exists, a reset link was sent" });
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const handleReset = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    try {
        const tokenResult = await resetTokenQueries.retrieveToken(token);

        if (!tokenResult) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (tokenResult.expires_at < new Date()) {
            await resetTokenQueries.deleteToken(token);
            return res.status(400).json({ message: "Reset token has expired" });
        }

        const userID = tokenResult.user_id;

        const hashedPwd = await bcrypt.hash(newPassword, 10);

        await userQueries.changeUserPassword(userID, hashedPwd);

        await resetTokenQueries.deleteToken(token);

        return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = { createUser, handleLogin, handleResetRequest, handleReset }