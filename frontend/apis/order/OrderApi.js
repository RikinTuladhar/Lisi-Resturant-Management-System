
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios/axiosInstance";

async function getOrders() {
    try {
        const res = await axiosInstance.get("public/orders");
        // Sort orders in descending order by ID
        return res.data.data.sort((a, b) => b.id - a.id);
    } catch (error) {
        throw error;
    }
}

export const useFetchOrders = () => {
    return useQuery({
        queryKey: ['fetchOrders'],
        queryFn: getOrders,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 5 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });
};
