import { network } from "hardhat";
/* import { id } from "ethers"; */

const { ethers, networkName } = await network.create();

console.log(`Deploying ProductTracking to ${networkName}...`);

const contract = await ethers.deployContract("ProductTracking");

console.log("Waiting for deployment...");
await contract.waitForDeployment();

const address = await contract.getAddress();

console.log("ProductTracking deployed at:", address);

// Convert the UUID to bytes32
/* const productId = id("4a26a2e0-e8ee-4e86-b9b3-473f66640cdc");

const metadataHash =
    "0x9e659fd7f02ddc9454e057d0f9969f7436d6662cd03d742bce78551129dc48aa";

const eventHash =
    "0x0c57aa3029f452812c942853c0ad0254229a8bd9b081bc1ded8cb254ca34a67c";

console.log("Creating product...");

const tx = await contract.createProduct(
    productId,
    metadataHash,
    eventHash
);

await tx.wait();

console.log("Product created successfully!"); */