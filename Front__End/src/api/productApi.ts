export const getProducts = async (userRole: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products" : normalizedUserRole === "transporter" ? "/transporter/products" : normalizedUserRole === "warehouse" ? "/warehouse/products" : "/store/products";

    const response = await fetch(
        `http://localhost:3000${apiEndpoint}`,
        {
            method: "POST"
        }
    )

    const data = await response.json();
    
    if(!response.ok) {
        throw new Error(data.error || "Fetching products failed")
    }

    return data;
};