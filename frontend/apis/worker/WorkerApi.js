import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios/axiosInstance";
import Cookies from "js-cookie";
async function getWorkers(params) {
    // eslint-disable-next-line no-useless-catch
    try {
        const res = await axiosInstance.get("users/get-user-by-role?role=worker", { params });
        const data = await res.data.data;
        return data;
    } catch (error) {
        throw error;
    }
}

export const useFetchWorkers = () => {
    return useQuery({
        queryKey: ['fetchWorkers'],
        queryFn: getWorkers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 5 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });
}

export const fetchWorkerById = async (id) => {
    const res = await axiosInstance.get(`users/get-user/${id}`);
    const data = res.data.data;
    return data;
}

export const  CreateItem = async (value ) => {
    const res = await axiosInstance.post("auth/register", value);
    const data = res.data.data;
    return data;
}

export const useCreateWorker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values) => {
            return await CreateItem(values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchWorkers']);
        },
    });
};