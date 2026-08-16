const apiURL = import.meta.env.VITE_MOBILE_API_URL;

export const getStatistics = async (userRole: any) => {
    const normalizedUserRole = userRole.toLowerCase();
    const apiEndpoint = normalizedUserRole === "manufacturer" ? "/manufacturer/products/statistics" : normalizedUserRole === "transporter" ? "/transporter/products/statistics" : normalizedUserRole === "warehouse" ? "/warehouse/products/statistics" : "/store/products/statistics";

    const response = await fetch(
        `${apiURL}${apiEndpoint}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    const data = await response.json();    

    if (!response.ok) {
        throw new Error(data.error || "Fetching statistics failed")
    }

    return data.userStatistics;
};