import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import Cookies from 'js-cookie'
import axiosInstance from "../../lib/axios/axiosInstance"

async function fetchItems() {
    const res = await axiosInstance.get("public/items");
    const data = res?.data.data;
    return data;
}

export const useFetchItems = () => {
    return useQuery({
        queryKey: ["fetchItems"],
        queryFn: fetchItems,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 5 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    })
}

export async function fetchItemById(id) {
    const res = await axiosInstance.get(`public/items/${id}`);
    const data = res?.data?.data;
    return data;
}

export async function EditItem(item_id, values, token) {
    if (!token) {
        throw new Error("No authentication token provided");
    }
    const parsed_token = JSON.parse(token);

    try {
        const res = await axiosInstance.put(`items/${item_id}`, values, {
            headers: {
                Authorization: `Bearer ${parsed_token}`
            }
        });
        return res.data.data;
    } catch (error) {
        console.error("Edit Item Error:", error);
        throw error;
    }
}

export async function DeleteItem(item_id, token) {
    if (!token) {
        throw new Error("No authentication token provided");
    }
    const parsed_token = JSON.parse(token);
    try {
        const res = await axiosInstance.delete(`items/${item_id}`, {
            headers: {
                Authorization: `Bearer ${parsed_token}`
            }
        })
        return res.data.message;
    } catch (error) {
        console.error("Delete Item Error:", error);
        throw error;
    }
}


export async function CreateItem(value, arg_token) {
    const token = JSON.parse(arg_token);
    if (!token) {
        throw new Error("Unauthenticated user");
    }
    try {
        const res = await axiosInstance.post("items", value, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.message;
    } catch (error) {
        console.error("Create Item Error:", error);
        throw error;
    }
}

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values) => {
            const token = Cookies.get('token');
            return await CreateItem(values, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchItems']);
        },
    });
};