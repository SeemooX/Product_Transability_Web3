export const prepareProduct = async (productData: any) => {    
    const response = await fetch(
        `http://localhost:3500/manufacturer/product/prepare`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(productData) // { name, reference, serialNumber, description }
        }
    )

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Product preparation failed")
    }

    return data;
}

export const confirmProduct = async (productData: any) => {
    const response = await fetch(
        `http://localhost:3500/manufacturer/product/confirm`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(productData) // { productID, txHash, name, reference, serialNumber, description }
        }
    )

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Product confirmation failed")
    }

    return data;
}