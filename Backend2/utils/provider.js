import { ethers } from "ethers";

// To reduce loading at every request
export const provider = new ethers.JsonRpcProvider(
    process.env.PUBLIC_RPC_URL
);