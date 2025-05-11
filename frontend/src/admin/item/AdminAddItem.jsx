import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { CreateItem } from '../../apis/item/ItemAPI';
import { useFetchCategory } from '../../apis/category/CategoryApi';

const AdminAddItem = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: ''
  });

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError } = useFetchCategory();

  const { mutateAsync: createItemMutation } = useMutation({
    mutationFn: async () => {
      // Convert category_id to number to ensure it's the correct type
      const submitData = {
        ...formData,
        category_id: Number(formData.category_id),
        price: Number(formData.price),
        description: formData.description || null
      };
      return await CreateItem(submitData, token);
    },
    onSuccess: () => {
      toast.success('Item added successfully!');
      navigate('/admin/item');
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || 'Failed to add item');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItemMutation();
    } catch (error) {
      console.error('Item creation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Toaster />
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Add New Item
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
            ) : isCategoriesError ? (
              <p className="text-red-500">Failed to load categories</p>
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
                  <option key={category.id} value={category.id}>
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddItem