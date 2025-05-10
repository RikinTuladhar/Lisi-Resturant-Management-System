import React, { useState } from "react";
import { EditCategory, useFetchCategory } from "../../../apis/category/CategoryApi";
import { Edit, Trash, X } from "lucide-react"; // Lucide-React icons
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteCategory } from "../../../apis/category/CategoryApi";
import toast, { Toaster } from "react-hot-toast";
import { useCreateCategory } from "../../../apis/category/CategoryApi";


const AdminCategory = () => {
    const queryClient = useQueryClient();
    const token = Cookies.get("token"); // Or however you're storing auth token
    const { mutateAsync: createCategoryMutation } = useCreateCategory(token);
    const { data: categories = [], isLoading, isError } = useFetchCategory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");


    const { mutateAsync: editCategoryMutation } = useMutation({
        mutationFn: async ({ category_id, values, token }) => {
            return await EditCategory(category_id, values, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchCategory']); // This triggers a refetch
            handleCloseModal(); // Optional: close the modal after successful edit
        },
    });

    const { mutateAsync: deleteCategoryMutation } = useMutation({
        mutationFn: async ({ category_id, token }) => {
            return await DeleteCategory(category_id, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchCategory']); // Refetch categories
        },
    });

    const handleDelete = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const res = await deleteCategoryMutation({ category_id: categoryId, token });
                toast.success(res)
            } catch (error) {
                console.error("Failed to delete category:", error);
            }
        }
    };




    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name); // set the form input
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                // Edit existing
                await editCategoryMutation({
                    category_id: editingCategory.id,
                    values: { name: categoryName },
                    token,
                });
                toast.success("Edited category successfully")
                setCategoryName("")
            } else {
                // Create new
                const value = {
                    name: categoryName
                }
                const from_arg_token = token
                const res = await createCategoryMutation({ value, from_arg_token });
                toast.success(res); // res is "Category created successfully" (from API response)
                setCategoryName("")
            }

            handleCloseModal();
        } catch (error) {
            toast.error("Action failed. Check console for details.");
            console.error("Error in create/edit category:", error);
        }
    };



    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Categories{" "}
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-3 py-1 rounded-full">
                        {categories.length}
                    </span>
                </h2>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Category
                </button>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="text-red-600 bg-red-100 p-4 rounded-lg">
                    Failed to load categories. Please try again.
                </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <tr
                                            key={category.id}
                                            className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition duration-150`}
                                        >
                                            <td className="px-6 py-4 text-gray-700">{category.id}</td>
                                            <td className="px-6 py-4 text-gray-700">{category.name}</td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {new Date(category.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 flex space-x-3">
                                                <button
                                                    aria-label="Edit category"
                                                    className="text-blue-600 hover:text-blue-800 transition duration-150"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    aria-label="Delete category"
                                                    className="text-red-600 hover:text-red-800 transition duration-150"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingCategory ? "Edit Category" : "Add Category"}
                            </h3>
                            <button
                                aria-label="Close modal"
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <label className="block mb-2 font-medium text-sm text-gray-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                required
                            />
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminCategory;