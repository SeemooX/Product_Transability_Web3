const { ethers } = require('ethers');

const hashMetadata = (metadata) => {
    return ethers.keccak256(ethers.toUtf8Bytes(metadata));
}

module.exports = { hashMetadata}