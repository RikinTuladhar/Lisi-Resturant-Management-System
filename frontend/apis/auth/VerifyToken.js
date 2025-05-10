import { useQuery } from '@tanstack/react-query';
import axiosInstance from "../../lib/axios/axiosInstance";

async function fetchUserProfile(token) {
    if (!token) {
        throw new Error("Token not available");
    }
    try {
        const res = await axiosInstance.get("/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = res?.data?.data?.user;
        console.log("User data", data);
        return data;
    } catch (error) {
        console.log("Error when fetching user data from token", error);
        throw error;
    }
}

export function useVerifyToken(token) {
    return useQuery({
        queryKey: ['userProfile', token],
        queryFn: () => fetchUserProfile(token),
        enabled: !!token,
        gcTime: 10 * 60 * 1000, // 10 minutes
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export default fetchUserProfile;

