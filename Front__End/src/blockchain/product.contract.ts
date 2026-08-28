import { id } from "ethers"

export const createProduct = async (ProductTraceContract: any, productData: any) => {
    const productId = id(productData.productId);
    const metadataHash = productData.metadataHash;
    const eventHash = productData.eventHash;

    const transaction = await ProductTraceContract.createProduct(productId, metadataHash, eventHash);
    await transaction.wait()

    return transaction.hash;
}

export const addTraceabilityEvent = async (ProductTraceContract: any, productData: any) => {
    const productId = id(productData.id);
    const stepType = Number(productData.stepType);
    const eventHash = productData.eventHash;

    const transaction = await ProductTraceContract.addTraceabilityEvent(productId, stepType, eventHash);
    await transaction.wait()

    return transaction.hash;
}