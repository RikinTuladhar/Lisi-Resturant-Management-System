import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { EditItem, fetchItemById } from '../../../apis/item/ItemAPI';
import { useFetchCategory } from '../../../apis/category/CategoryApi';

const AdminEditItem = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = Cookies.get('token');
    const queryClient = useQueryClient();

    // Fetch categories
    const { data: categories = [], isLoading: isCategoriesLoading } = useFetchCategory();

    // Fetch item details
    const { data: itemDetails, isLoading: isItemLoading, isError: isItemError } = useQuery({
        queryKey: ['fetchItemDetails', id],
        queryFn: () => fetchItemById(id),
        enabled: !!id,
        onSuccess: (data) => {
            console.log('Fetched Item Details:', data);
        }
    });

    // Initial form state
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: ''
    });

    // Update form when item details are fetched
    useEffect(() => {
        if (itemDetails) {
            setFormData({
                name: itemDetails.name || '',
                category_id: String(itemDetails.category?.id) || '', // Use nested category
                description: itemDetails.description || '',
                price: String(itemDetails.price) || '' // Convert to string
            });
        }
    }, [itemDetails]);

    // Edit item mutation
    const { mutateAsync: editItemMutation } = useMutation({
        mutationFn: async () => {
            const submitData = {
                ...formData,
                category_id: Number(formData.category_id),
                price: Number(formData.price),
                description: formData.description || null
            };
            return await EditItem(id, submitData, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchItems']);
            toast.success('Item updated successfully!');
            navigate('/admin/item');
        },
        onError: (error) => {
            toast.error(error?.response?.data.message || 'Failed to update item');
        }
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editItemMutation();
        } catch (error) {
            console.error('Item edit error:', error);
        }
    };

    // Loading and error states
    if (isItemLoading) {
        return <div className="text-center py-10">Loading item details...</div>;
    }

    if (isItemError) {
        return <div className="text-center text-red-500 py-10">Failed to load item details</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <Toaster />
            <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Edit Item
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Item Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g., Puri Tarkari"
                        />
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        {isCategoriesLoading ? (
                            <p className="text-gray-500">Loading categories...</p>
                        ) : (
                            <select
                                name="category_id"
                                id="category_id"
                                required
                                value={formData.category_id}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Select a Category</option>
                                {categories.map((category) => (
                                    <option 
                                        key={category.id} 
                                        value={String(category.id)}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Optional item description"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price (Rs.)
                        </label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g., 120"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Update Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminEditItem