import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchCategory() {
    try {
        const res = await axiosInstance.get('public/categories')
        const data = await res?.data.data
        return data;
    } catch (error) {
        throw error
    }
}

export const useFetchCategory = () => {
    return useQuery({
        queryKey: ['fetchCategory'],
        queryFn: fetchCategory,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 5 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    })
}

export async function EditCategory(category_id, values, token) {
    if (!token) {
        return
    }
    const parsed_token = JSON.parse(token)

    try {
        const res = await axiosInstance.put(`categories/${category_id}`, values, {
            headers: {
                Authorization: `Bearer ${parsed_token}`
            }
        })
        const data = await res.data.data;
        return data
    } catch (error) {
        throw error
    }
}

export async function DeleteCategory(category_id, token) {
    if (!token) {
        return
    }
    const parsed_token = JSON.parse(token);
    try {
        const res = await axiosInstance.delete(`categories/${category_id}`, {
            headers: {
                Authorization: `Bearer ${parsed_token}`
            }
        })
        const data = await res.data.message
        return data
    } catch (error) {
        throw error
    }
}

async function CreateCategory(values, token) {
    if (!token) {
        return
    }
    const parsed_token = JSON.parse(token);
    try {
        const res = await axiosInstance.post(`categories`, values, {
            headers: {
                Authorization: `Bearer ${parsed_token}`
            }
        })
        const data = await res.data.message
        return data
    } catch (error) {
        throw error
    }
}


export const useCreateCategory = (token) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values) => {
            const { value, from_arg_token } = values

            return await CreateCategory(value, from_arg_token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchCategory']);
        },
    });
};
