const apiURL = import.meta.env.VITE_MOBILE_API_URL;

export const acceptAccount = async (userId: any) => {
    const response = await fetch(`${apiURL}/admin/accept/${userId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Accepting account failed");
    }

    return data.user;
};

export const rejectAccount = async (userId: any) => {
    const response = await fetch(`${apiURL}/admin/reject/${userId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Rejecting account failed");
    }

    return data.user;
};