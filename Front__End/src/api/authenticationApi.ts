const apiURL = import.meta.env.VITE_BROWSER_API_URL;

export const loginUser = async (loginObject: any) => {
    const response = await fetch(
        `${apiURL}/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginObject)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "login failed");
    }

    return data;
};

export const createUser = async (singupObject: any) => {
    const response = await fetch(
        `${apiURL}/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(singupObject)
        }
    )

    const data = await response.json();
    
    if(!response.ok) {
        throw new Error(data.error || "Creating user failed")
    }

    return data;
};
