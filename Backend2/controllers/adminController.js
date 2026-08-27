const adminQueries = require('../Queries/adminQueries');
const sendEmail = require("../utils/emailService");
const bcrypt = require('bcrypt');

const acceptUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await adminQueries.acceptUser(id, hashedPassword);


        return res.status(201).json({
            message: "Utilisateur accepté avec succès.",
            data: user,
        });
    } catch (error) {
        console.error("acceptUser error:", error);

        return res.status(500).json({
            message: error.message || "Erreur lors de l'acceptation.",
        });
    }
};

const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await adminQueries.rejectUser(id);

        /* await sendEmail({
            to: email,
            subject: "TraceProduct Rejection",
            html: `<!-- Header -->
                    <h2 style="text-align:center;color:#1e40af;margin-bottom:20px;">Unfortunately You Application Rejected</h2>

                    <!-- Body -->
                    <p style="font-size:16px;color:#111827;">Hello,</p>

                    <p style="font-size:15px;color:#374151;line-height:1.6;">
                    We received a request to create an account for your <strong>TraceProduct APP</strong>.
                    We are sorry to inform you that your application was rejected
                    </p>`
        });
 */
        return res.status(200).json({
            message: "Demande rejetée avec succès.",
            data: request,
        });
    } catch (error) {
        console.error("rejectUser error:", error);

        return res.status(500).json({
            message: error.message || "Erreur lors du rejet.",
        });
    }
};

const getRequestAccounts = async (req, res) => {
    try {
        const requests = await adminQueries.getRequestAccounts();

        return res.status(200).json({
            message: "Demandes récupérées avec succès.",
            users: requests,
        });
    } catch (error) {
        console.error("getRequestAccounts error:", error);

        return res.status(500).json({
            message:
                error.message ||
                "Erreur lors de la récupération des demandes.",
        });
    }
};

module.exports = { acceptUser, rejectUser, getRequestAccounts }