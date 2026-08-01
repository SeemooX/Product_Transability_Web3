export const getStatistics = async (userRole: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products/statistics" : normalizedUserRole === "transporter" ? "/transporter/products/statistics" : normalizedUserRole === "warehouse" ? "/warehouse/products/statistics" : "/store/products/statistics";

    const response = await fetch(
        `http://localhost:3000${apiEndpoint}`,
        {
            method: "POST"
        }
    )

    const data = await response.json();
    
    if(!response.ok) {
        throw new Error(data.error || "Fetching statistics failed")
    }

    return data;
};