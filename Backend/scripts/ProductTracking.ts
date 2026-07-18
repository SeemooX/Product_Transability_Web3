import { network } from "hardhat";

const { ethers, networkName } = await network.create();

console.log(`Deploying ProductTracking to ${networkName}...`);

const counter = await ethers.deployContract("ProductTracking");

console.log("Waiting for the deployment tx to confirm");
await counter.waitForDeployment();

console.log("ProductTracking address:", await counter.getAddress());

console.log("Deployment successful!");