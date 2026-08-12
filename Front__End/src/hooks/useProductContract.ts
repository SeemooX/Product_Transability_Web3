import { Contract, BrowserProvider } from "ethers";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { ProductTrackingAbi } from "@/utils/productABI";
/* import type { Eip1193Provider } from "ethers"; */

export function useProductContract() {
  const { isConnected } = useAppKitAccount();

  const { walletProvider } = useAppKitProvider("eip155");

  const getContract = async () => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }

    const ethersProvider = new BrowserProvider(walletProvider as any); // Later change the type ot "Eip1193Provider"

    const signer = await ethersProvider.getSigner();

    return new Contract(
      import.meta.env.VITE_PRODUCT_TRACE_CONTRACT_ADD,
      ProductTrackingAbi,
      signer
    );
  };


  return {
    getContract
  };
}