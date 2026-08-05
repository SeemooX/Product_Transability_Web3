export const getProducts = async (userRole: any, page: any, debouncedSearch: any, sort: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products" : normalizedUserRole === "transporter" ? "/transporter/products/available" : normalizedUserRole === "warehouse" ? "/warehouse/products" : "/store/products";

    const response = await fetch(
        `http://localhost:3500${apiEndpoint}?page=${page}&search=${debouncedSearch}&sort=${sort}`,
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

export const getHomeProducts = async (userRole: any, page: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products" : normalizedUserRole === "transporter" ? "/transporter/products" : normalizedUserRole === "warehouse" ? "/warehouse/products" : "/store/products";

    const response = await fetch(
        `http://localhost:3500${apiEndpoint}?page=${page}`,
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
        `http://localhost:3500/products/${productId}`,
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

    return data.information;
}