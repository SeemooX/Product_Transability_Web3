import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any
    }
}

let provider;
export const connectWallet = async () => {
    try {
            if(window.ethereum == null) {
        console.log("MetaMask not installed");
        provider = ethers.getDefaultProvider();
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        return {provider, signer, address}
    }
    } catch (error) {
        console.log("Wallet error:", error);
    }
}

export const isConnected = () => {}