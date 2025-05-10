import axiosInstance from "../../lib/axios/axiosInstance"

async function LogoutAPI(token) {
    if (!token) {
        return
    }
    try {
        const res = await axiosInstance.get("auth/logout", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.data;
        return data;
    } catch (error) {
        throw error
    }
}

export default LogoutAPI