import { useQuery } from '@tanstack/react-query';
import axiosInstance from "../../lib/axios/axiosInstance";

async function fetchTotalUsers() {
    try {
        const res = await axiosInstance.get("users/get-users");
        const data = res?.data?.data;
        return data;
    } catch (error) {
        console.log("Error when fetching users", error);
        throw error;
    }
}

export function useTotalUsers() {
    return useQuery({
        queryKey: ['useTotalUsers'],
        queryFn: () => fetchTotalUsers(),
        gcTime: 10 * 60 * 1000, // 10 minutes
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}


