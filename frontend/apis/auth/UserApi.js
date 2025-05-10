import axiosInstance from "../../lib/axios/axiosInstance";
export async function LoginAPI(params) {
    try {
        const res = await axiosInstance.post("/auth/login", params);
        return res.data;
    } catch (error) {
        throw error; // Optional: rethrow for caller to handle
    }
}


