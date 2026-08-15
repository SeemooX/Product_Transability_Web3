import { prepareProduct, confirmProduct } from "@/api/manufacturer";
import { confirmTraceProduct, prepareTraceProduct } from "@/api/productApi";
import { addTraceabilityEvent, createProduct } from "@/blockchain/product.contract";
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

export const addTraceabilityProductFlow = async (
    productId: any,
    productData: any,
    ProductTraceContract: any
) => {
    try {
        const preparedProductData = {
            stepType: productData.get("stepType"),
            location: productData.get("location"),
            notes: productData.get("notes"),
        };

        const preparedProduct = await prepareTraceProduct(
            productId,
            preparedProductData
        );

        if (!preparedProduct) {
            throw new Error("La préparation du produit a échoué.");
        }

        const blockchainProductData = {
            id: productId,
            stepType: productData.get("stepType"),
            eventHash: preparedProduct.eventHash,
        };

        const txHash = await addTraceabilityEvent(
            ProductTraceContract,
            blockchainProductData
        );

        if (!txHash) {
            throw new Error(
                "La création de l'événement blockchain a échoué."
            );
        }

        productData.append("txHash", txHash);
        const confirmedProductData = productData;
        const confirmedTrace = await confirmTraceProduct(
            productId,
            confirmedProductData
        );

        if (!confirmedTrace) {
            throw new Error(
                "La confirmation de la traçabilité a échoué."
            );
        }

        return confirmedTrace;
    } catch (error) {
        console.error(
            "addTraceabilityProductFlow failed:",
            error
        );

        // propagate the error to the component
        throw error;
    }
};