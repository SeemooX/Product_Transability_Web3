import { prepareProduct, confirmProduct } from "@/api/manufacturer";
import { createProduct } from "@/blockchain/product.contract";
interface ProductData {
    name: string;
    reference: string;
    serialNumber: string;
    description: string;
}

export const createProductFlow = async (productData: ProductData, ProductTraceContract: any) => {    
    const preparedProduct = await prepareProduct(productData);
    
    const txHash = await createProduct(
        ProductTraceContract,
        {
            productId: preparedProduct.productID,
            metadataHash: preparedProduct.metadataHash,
            eventHash: preparedProduct.eventHash,
        }
    );

    const confirmedProduct = await confirmProduct({
        productID: preparedProduct.productID,
        txHash,
        name: productData.name,
        reference: productData.reference,
        serialNumber: productData.serialNumber,
        description: productData.description,
    });

    return confirmedProduct;
};