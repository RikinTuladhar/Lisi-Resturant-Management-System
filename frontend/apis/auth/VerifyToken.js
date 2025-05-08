import axiosInstance from "../../lib/axios/axiosInstance";

export default async function VerifyToken(token) {
    if (!token) {
        throw new Error("Token not available");
    }
    try {
        const res = await axiosInstance.get("/auth/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await res?.data?.data?.user;
        console.log("User data", data)
        return data
    } catch (error) {
        console.log("Error when fetching user data from token", error)
        throw error
    }
}

