const apiURL = import.meta.env.VITE_BROWSER_API_URL;

export const prepareProduct = async (productData: any) => {    
    const response = await fetch(
        `${apiURL}/manufacturer/product/prepare`,
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
        `${apiURL}/manufacturer/product/confirm`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: productData
        }
    )

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Product confirmation failed")
    }

    return data;
}