const userQueries = require('../Queries/userQueries');

const getUser = async (req, res) => {
    try {
        const userID = req.id;

        const callingUser = await userQueries.getUserById(userID);
        if (!callingUser) {
            return res.status(404).json({ message: "Something went wrong, could not find" });
        }

        const userInfos = {
            fullName: callingUser.fullName,
            email: callingUser.email,
            role: callingUser.role,
            companyName: callingUser.companyName,
            walletAddress: callingUser.walletAddress,
            imageUrl: callingUser.imageUrl
        }

        return res.status(200).json({ user: userInfos });
    } catch (error) {
        console.error("server error", error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

const updateUserInfos = async (req, res) => {
    try {
        const userID = req.id;

        const { fullName, walletAddress } = req.body;

        const updates = {};

        if (fullName !== undefined) {
            updates.fullName = fullName;
        }

        if (walletAddress !== undefined) {
            updates.walletAddress = walletAddress;
        }

        const updatedUser = await userQueries.updateUser(userID, updates);

        return res.status(200).json({
            message: "User information updated successfully",
            user: updatedUser[0],
        });

    } catch (error) {
        console.error("server error", error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const requestForAccount = async (req, res) => {
    try {
        const { fullName, email, role, walletAddress, companyName } = req.body;

        if (!fullName || !email || !role || !walletAddress) {
            return res.status(400).json({
                message: "fullName, email, role and walletAddress are required.",
            });
        }

        const allowedRoles = [
            "MANUFACTURER",
            "TRANSPORTER",
            "WAREHOUSE",
            "STORE",
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role.",
            });
        }

        const profileRequest = await userQueries.createProfileRequest({
            fullName,
            email,
            role,
            walletAddress,
            companyName,
        });

        return res.status(201).json({
            message: "Votre demande de création de compte a été envoyée.",
            data: profileRequest,
        });
    } catch (error) {
        console.error("requestForAccount error:", error);
        return res.status(500).json({
            error:
                error.message ||
                "Une erreur est survenue lors de la création de votre demande.",
        });
    }
};

module.exports = { getUser, updateUserInfos, requestForAccount }