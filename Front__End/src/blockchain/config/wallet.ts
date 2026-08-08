import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia, hardhat } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// 1. Get projectId
const projectId = import.meta.env.VITE_PROJECT_ID;

// 2. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia, hardhat];

// 3. Create a metadata object - optional
const metadata = {
  name: "Product Traceability",
  description: "This application is about tracing product in asecure way, and guarentees not tampering happens",
  url: "http://localhost:5173", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  defaultNetwork: hardhat,
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});