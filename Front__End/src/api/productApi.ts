const apiURL = import.meta.env.VITE_BROWSER_API_URL;

export const getProducts = async (userRole: any, page: any, debouncedSearch: any, sort: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products" : normalizedUserRole === "transporter" ? "/transporter/products/available" : normalizedUserRole === "warehouse" ? "/warehouse/products" : "/store/products";

    const response = await fetch(
        `${apiURL}${apiEndpoint}?page=${page}&search=${debouncedSearch}&sort=${sort}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Fetching products failed")
    }

    return data;
};

export const getHomeProducts = async (userRole: any, page: any, debouncedSearch: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products" : normalizedUserRole === "transporter" ? "/transporter/products" : normalizedUserRole === "warehouse" ? "/warehouse/products" : "/store/products";

    const response = await fetch(
        `${apiURL}${apiEndpoint}?page=${page}&search=${debouncedSearch}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Fetching products failed")
    }

    return data;
};

export const getProductDetails = async (productId: any) => {
    const response = await fetch(
        `${apiURL}/products/${productId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    const data = await response.json();    

    if (!response.ok) {
        throw new Error(data.error || "Fetching products details failed")
    }

    return data.information;
}

export const getProductHistory = async (productId: any) => {
    const response = await fetch(
        `${apiURL}/products/${productId}/history`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    const data = await response.json();    

    if (!response.ok) {
        throw new Error(data.error || "Fetching products history failed")
    }

    return data.history;
}

export const prepareTraceProduct = async (productId: any, productData: any) => {    
    const response = await fetch(
        `${apiURL}/products/${productId}/trace/prepare`,
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

export const confirmTraceProduct = async (productId: any, productData: any) => {
    const response = await fetch(
        `${apiURL}/products/${productId}/trace/confirm`,
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
