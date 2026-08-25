const apiURL = import.meta.env.VITE_MOBILE_API_URL;

export const getUser = async () => {
    const response = await fetch(`${apiURL}/users/me`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Fetching user failed");
    }

    return data.user;
};

export const changeUser = async (updateUserObject: any) => {
    const response = await fetch(`${apiURL}/users/me`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(updateUserObject)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Changing user information failed");
    }

    return data;
};