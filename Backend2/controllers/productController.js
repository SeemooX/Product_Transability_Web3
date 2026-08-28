const { ethers } = require('ethers');
const { pool } = require("../config/dbConnection");
const productQueries = require('../Queries/productQueries');
const { provider } = require('../utils/provider');
const productStatusHistoryQueries = require('../Queries/productStatusHistoryQueries');
const userQueries = require('../Queries/userQueries');
const { hashMetadata } = require('../utils/hashMetadata');
const { CONTRACT_FUNCTIONS } = require('../utils/contractABI');
const imageKitClient = require('../config/imageKit');
const { fileTypeFromBuffer } = require("file-type");
const { toFile } = require('@imagekit/nodejs');
const { uuid } = require('drizzle-orm/pg-core');

const prepareTraceProduct = async (req, res) => {
    console.log("enter prepare");
    
    try {
        let { stepType, location, notes } = req.body;
        const { id: productID } = req.params;

        /* if (!isUUID(productID)) {
            return res.status(400).json({
                error: "Invalid product ID."
            });
        } */

        // Step type
        stepType = Number(stepType);
        if (!Number.isInteger(stepType) || stepType <= 0) {
            return res.status(400).json({
                error: "Invalid step type."
            });
        }

        // Location
        if (location !== undefined && location !== null) {
            if (typeof location !== "string") {
                return res.status(400).json({
                    error: "Location must be a string."
                });
            }

            location = location.trim();

            if (location.length > 255) {
                return res.status(400).json({
                    error: "Location is too long."
                });
            }
        }

        // Notes
        if (notes !== undefined && notes !== null) {
            if (typeof notes !== "string") {
                return res.status(400).json({
                    error: "Notes must be a string."
                });
            }

            notes = notes.trim();

            if (notes.length > 2000) {
                return res.status(400).json({
                    error: "Notes are too long."
                });
            }
        }

        const existingProduct = await productQueries.retrieveProduct(productID);
        if (!existingProduct) {
            return res.status(409).json({ error: "This product does not exists" });
        }

        const currentStepType = await productQueries.retrieveStepType(productID);
        if (!currentStepType) {
            return res.status(409).json({ error: "Something went wrong, this product doesn't have a current status" });
        }

        if (Number(currentStepType) === 2) {
            if (Number(stepType) !== 3 && Number(stepType) !== 7) {
                return res.status(409).json({
                    error: "The stepType you entered is not convenient"
                });
            }
        } else if (Number(stepType) !== (Number(currentStepType) + 1)) {
            return res.status(409).json({ error: "The stepType you entered is not convenient" });
        }

        const eventData = {
            productID: productID,
            stepType: stepType,
            location: location ? location : "",
            notes: notes ? notes : "",
            performedBy: req.id
        }
        const eventDataString = JSON.stringify(eventData);
        const hashedEventData = hashMetadata(eventDataString);
        console.log("success prepare");

        return res.status(200).json({ productID, eventHash: hashedEventData });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const confirmTraceProduct = async (req, res) => {
    console.log("entered confirm");
    try {
        let { stepType, location, notes, txHash } = req.body; // Consider later using Redis cache
        const { id: productID } = req.params;

        stepType = Number(stepType);
        if (!Number.isInteger(stepType) || stepType <= 0) {
            return res.status(400).json({
                error: "Invalid step type."
            });
        }

        if (location !== undefined && location !== null) {
            if (typeof location !== "string") {
                return res.status(400).json({
                    error: "Location must be a string."
                });
            }

            location = location.trim();

            if (location.length > 255) {
                return res.status(400).json({
                    error: "Location is too long."
                });
            }
        }

        if (notes !== undefined && notes !== null) {
            if (typeof notes !== "string") {
                return res.status(400).json({
                    error: "Notes must be a string."
                });
            }

            notes = notes.trim();

            if (notes.length > 2000) {
                return res.status(400).json({
                    error: "Notes are too long."
                });
            }
        }

        const apiCaller = await userQueries.getUserById(req.id);

        if (!ethers.isHexString(txHash, 32)) {
            return res.status(400).json({
                error: "Invalid transaction hash"
            });
        }

        const receipt = await provider.getTransactionReceipt(txHash.trim());
        if (!receipt) {
            return res.status(400).json({
                error: "Transaction not mined yet"
            });
        }
        if (receipt.status === 0) {
            return res.status(400).json({
                error: "Transaction failed"
            })
        }

        const tx = await provider.getTransaction(txHash.trim());

        if (!tx) {
            return res.status(400).json({
                error: "Transaction not found"
            });
        }

        const iface = new ethers.Interface(CONTRACT_FUNCTIONS);

        let decoded;
        try {
            decoded = iface.parseTransaction({
                data: tx.data,
                value: tx.value,
            });
        } catch (error) {
            console.error("DECODE ERROR:", error);

            return res.status(400).json({
                error: "Invalid contract call",
            });
        }

        if (!decoded) {
            return res.status(400).json({
                error: "Failed to extract information"
            });
        }
        if (decoded.args[0] !== ethers.id(productID)) {
            return res.status(400).json({
                error: "Invalid product ID"
            });
        }
        if (!decoded || decoded.name !== "addTraceabilityEvent") {
            return res.status(400).json({
                error: "Transaction must call addTraceabilityEvent"
            });
        }

        const eventData = {
            productID: productID,
            stepType: stepType,
            location: location ? location : "",
            notes: notes ? notes : "",
            performedBy: req.id
        }
        const eventDataString = JSON.stringify(eventData);
        const hashedEventData = hashMetadata(eventDataString);
        if (hashedEventData !== decoded.args[2]) {
            return res.status(400).json({
                error: "Data should never be changed"
            });
        }

        const statuscode = await productStatusHistoryQueries.getStatusCode(stepType);
        if (!statuscode) {
            return res.status(400).json({
                error: "There no steptype like this"
            });
        }

        let imageUrl = null;
        let imageFileId = null;

        // Validation
        if (req.file) {
            const type = await fileTypeFromBuffer(req.file.buffer);

            if (!type || !["jpg", "png", "webp"].includes(type.ext)) {
                return res.status(400).json({
                    message: "Invalid image file",
                });
            }
            const fileName = `${uuid()}.jpg`

            const uploaded = await imageKitClient.files.upload({
                file: await toFile(req.file.buffer, fileName),
                fileName,
                folder: "/TraceabilitySteps",
                useUniqueFileName: true
            });

            imageUrl = uploaded.url;
            /* imageFileId = uploaded.fileId; */ // Used to indentify the image to delete in imagkit, and it needs to be stored in the DB also. however it is not needed in this app
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const changerId = req.id;
            const currentStatus = "CREATED";

            const qrCode = {
                productId: productID,
            };

            const performedBy = changerId;
            const stepTypeId = stepType;

            // Insert first status history
            await productStatusHistoryQueries.insertProductStatusHistory(
                client,
                {
                    productId: productID,
                    stepTypeId: stepType,
                    location,
                    performedBy,
                    notes,
                    stepPhoto: imageUrl,
                    txHash
                }
            );

            // Update product
            const updatedProduct = await productQueries.updateProduct(
                client,
                {
                    productID,
                    statuscode: statuscode.code
                }
            );

            await client.query("COMMIT");

            return res.status(200).json({
                message: "Product successfully updated"
            });

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(error);

            // PostgreSQL unique violation
            if (error.code === "23505") {
                return res.status(409).json({
                    error: "Product already exists"
                });
            }
            console.log("passed confirm");


            return res.status(500).json({
                error: "Product update failed"
            });

        } finally {

            client.release();
        }

    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const productHistory = async (req, res) => {
    try {
        const { id: productId } = req.params;

        const history = await productQueries.getProductHistory(productId);
        if (history == null) {
            return res.status(500).json({
                error: "Failed to retrieve product history."
            });
        }

        return res.status(200).json({ history: history });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const productInformation = async (req, res) => {
    try {
        const { id: productId } = req.params;

        const infos = await productQueries.getProductInformation(productId);
        if (infos == null) {
            return res.status(500).json({
                error: "Failed to retrieve product information."
            });
        }

        return res.status(200).json({ information: infos });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { prepareTraceProduct, confirmTraceProduct, productInformation, productHistory }