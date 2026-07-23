import { network } from "hardhat";
import { id } from "ethers";

const { ethers, networkName } = await network.create();

console.log(`Deploying ProductTracking to ${networkName}...`);

const contract = await ethers.deployContract("ProductTracking");

console.log("Waiting for deployment...");
await contract.waitForDeployment();

const address = await contract.getAddress();

console.log("ProductTracking deployed at:", address);

// Convert the UUID to bytes32
const productId = id("5b6e19f8-aa1f-49a8-a26a-3738fa277958");

const metadataHash =
    "0x3cd2829aed01993784a016cb0fe8e8ca1ff88f55025df3bd690e84d446fe21e6";

const eventHash =
    "0x0c57aa3029f452812c942853c0ad0254229a8bd9b081bc1ded8cb254ca34a67c";

console.log("Creating product...");

const tx = await contract.createProduct(
    productId,
    metadataHash,
    eventHash
);

await tx.wait();

console.log("Product created successfully!");

/* console.log("updating product...");

const newEventHash = "0x4a1a294441937a04899bd6a7ed83bc1bb3ba4dfc8dc98832aacfd067a939c5b1";

const tx1 = await contract.addTraceabilityEvent(
    productId,
    2,
    newEventHash
);

await tx1.wait();

console.log("Product updated successfully!"); */