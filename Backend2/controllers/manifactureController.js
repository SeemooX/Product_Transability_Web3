const { v4: uuid } = require('uuid');
const productQueries = require('../Queries/productQueries');
const { hashMetadata } = require('../utils/hashMetadata');

const prepareProduct = async (req, res) => {
    try {
        const { name, reference, serialNumber, description } = req.body;
        
        if (!name || !reference || !serialNumber) return res.status(400).json({ error : 'You need to provide the <name, refrence, and serial number>' });

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

        const isReferenceExists = await productQueries.checkReference(reference.trim());
        if (isReferenceExists) {
            return res.status(409).json({ error: "This reference already exitst" });
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

        const productID = uuid();

        return res.status(200).json({ productID, metadataHash: hashedMetaData });
    } catch (error) {
        console.error("sever error", error);
        return res.status(500).json({ error: error.message });
    }
}

const confirmProduct = async (req, res) => { }

module.exports = { prepareProduct, confirmProduct };