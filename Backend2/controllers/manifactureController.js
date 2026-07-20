const { v4: uuid } = require('uuid');
const { ethers } = require('ethers');
const QRCode = require('qrcode');
const {pool} = require("../config/dbConnection");
const userQueries = require('../Queries/userQueries');
const productQueries = require('../Queries/productQueries');
const productStatusHistoryQueries = require('../Queries/productStatusHistoryQueries');
const { hashMetadata } = require('../utils/hashMetadata');
const { CONTRACT_FUNCTIONS } = require('../utils/contractABI');
const { provider } = require('../utils/provider');

const prepareProduct = async (req, res) => {
    try {
        let { name, reference, serialNumber, description } = req.body;

        if (!name || !reference || !serialNumber) return res.status(400).json({ error: 'You need to provide the <name, refrence, and serial number>' });

        if (!/^[A-Za-z0-9 _-]{1,100}$/.test(name.trim())) {
            return res.status(400).json({ error: "Invalid name." });
        }

        if (!/^[A-Za-z0-9_-]{1,100}$/.test(reference.trim())) {
            return res.status(400).json({ error: "Invalid reference." });
        }

        if (!/^[A-Za-z0-9-]{1,50}$/.test(serialNumber.trim())) {
            return res.status(400).json({ error: "Invalid serial number." });
        }

        if (description) {
            description = description.trim();
            if (description.length > 1000) {
                return res.status(400).json({ error: "Description is too long." });
            }
        }

        const existingProduct = await productQueries.checkProductUniqueness(reference.trim(), serialNumber.trim());
        if (existingProduct) {
            return res.status(409).json({ error: "This product already exitsts" });
        }

        const metadata = {
            name: name.trim(),
            reference: reference.trim(),
            serialNumber: serialNumber.trim(),
            description: description ? description.trim() : ""
        }
        const metadataString = JSON.stringify(metadata);

        // This will has something like this "'{"name":"John Doe","reference":"REF-2025",...}'"
        // Later we could replace it with "solidityPackedKeccak256", currently not needed
        // since we don't have any verification of hash to do in the contract
        const hashedMetaData = hashMetadata(metadataString);

        const eventData = {
            stepTypeId: 0,
            location: "Factory",
        }
        const eventDataString = JSON.stringify(eventData);
        const hashedEventData = hashMetadata(eventDataString);

        const productID = uuid();

        return res.status(200).json({ productID, metadataHash: hashedMetaData, eventHash: hashedEventData });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: error.message });
    }
}

const confirmProduct = async (req, res) => {
    try {
        let { productID, txHash, name, reference, serialNumber, description } = req.body; // Consider later using Redis cache

        if (!/^[A-Za-z0-9 _-]{1,100}$/.test(name.trim())) {
            return res.status(400).json({ error: "Invalid name." });
        }

        if (!/^[A-Za-z0-9_-]{1,100}$/.test(reference.trim())) {
            return res.status(400).json({ error: "Invalid reference." });
        }

        if (!/^[A-Za-z0-9-]{1,50}$/.test(serialNumber.trim())) {
            return res.status(400).json({ error: "Invalid serial number." });
        }

        if (description) {
            description = description.trim();
            if (description.length > 1000) {
                return res.status(400).json({ error: "Description is too long." });
            }
        }

        const existing = await productQueries.getByBlockchainId(productID);
        if (existing) {
            return res.status(409).json({
                error: "Product already confirmed"
            });
        }

        const apiCaller = await userQueries.getUserById(req.id);

        if (!ethers.isHexString(txHash, 32)) {
            return res.status(400).json({
                error: "Invalid transaction hash"
            });
        }

        const receipt = await provider.getTransactionReceipt(txHash.trim());
        /* Example Output
        {
            status: 1, // This field indicates transactin succeded or failed
            blockNumber: 123456,
            gasUsed: 21000n,
            logs: [ ... ]
        }
        */
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
        /* Example Output
        {
            hash: "...",
            from: "0x...",
            to: "0x...",
            value: 1000000000000000000n,
            gasLimit: 21000n,
            nonce: 15,
            data: "0x..."
        }
        */
        if (!tx) {
            return res.status(400).json({
                error: "Transaction not found"
            })
        }
        if (tx.from.toLowerCase() !== apiCaller.walletAddress.toLowerCase()) {
            return res.status(400).json({
                error: "You did not make this transaction"
            })
        }
        if (tx.to.toLowerCase() !== process.env.PRODUCT_TRACKING_ADDRESS) {
            return res.status(400).json({
                error: "Transaction is not for the ProductTracking contract"
            })
        }

        const iface = new ethers.Interface(CONTRACT_FUNCTIONS);

        // It will read the first 4 bytes, and looks for the matching selector in the ABI. If found it gets decoded
        let decoded;
        try {
            decoded = iface.parseTransaction({
                data: tx.data,
                value: tx.value,
            });
        } catch {
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
        if (!decoded || decoded.name !== "createProduct") {
            return res.status(400).json({
                error: "Transaction must call createProduct"
            });
        }

        const metadata = {
            name: name.trim(),
            reference: reference.trim(),
            serialNumber: serialNumber.trim(),
            description: description ? description.trim() : ""
        }
        const metadataString = JSON.stringify(metadata);
        const metadataHash = hashMetadata(metadataString);
        if (metadataHash !== decoded.args[1]) {
            return res.status(400).json({
                error: "Data should never be changed"
            });
        }

        // Drizzle automatically starts BEGIN, COMMIT of things are complete, ROLLBACK if an error is thrown
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const manufacturerId = req.id;
            const currentStatus = "CREATED";

            const qrCode = {
                productId: productID,
            };

            // Insert product
            const insertedProduct = await productQueries.insertProduct(
                client,
                {
                    id_product: productID,
                    manufacturerId,
                    name,
                    reference,
                    serialNumber,
                    description,
                    currentStatus,
                    qrCode,
                    metadataHash
                }
            );

            const performedBy = manufacturerId;
            const location = "Factory";
            const stepTypeId = 1;

            // Insert first status history
            await productStatusHistoryQueries.insertProductStatusHistory(
                client,
                {
                    productId: insertedProduct.id_product,
                    stepTypeId,
                    location,
                    performedBy,
                    txHash
                }
            );

            await client.query("COMMIT");

            return res.status(200).json({
                message: "Product successfully created"
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

            return res.status(500).json({
                error: "Product creation failed"
            });

        } finally {

            client.release();
        }

    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { prepareProduct, confirmProduct };