import React, { useState } from "react";
import { Eye, Edit, Trash, X } from "lucide-react";
import { useFetchItems, fetchItemById, DeleteItem } from "../../../apis/item/ItemApi";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
const AdminItem = () => {

  const token = Cookies.get("token")
  const { data: items = [], isLoading, isError } = useFetchItems();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const queryClient = useQueryClient();
  const { mutateAsync: deleteItemMutation } = useMutation({
    mutationFn: async ({ item_id, token }) => {
      return await DeleteItem(item_id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fetchItems']); // Refetch items
    },
  });

  const handleDelete = async (item_id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItemMutation({ item_id, token })
        toast.success(`Item with ID ${item_id} deleted`);
      } catch (error) {
        toast.error("Failed to delete item")
      }
    }
  };

  const handleView = async (id) => {
    try {
      const item = await fetchItemById(id); // API call
      setSelectedItem(item);
      setViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch item details.");
    }
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Items{" "}
          <span className="bg-purple-100 text-purple-800 text-sm font-medium ml-2 px-3 py-1 rounded-full">
            {items.length}
          </span>
        </h2>
        <Link
          to="/admin/item/add"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          Add Item
        </Link>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      )}

      {isError && (
        <div className="text-red-600 bg-red-100 p-4 rounded-lg">
          Failed to load items. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition duration-150`}
                    >
                      <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 text-gray-700">{item.description || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-700">Rs. {item.price}</td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => handleView(item.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          to={`/admin/item/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Item Details</h3>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Name:</strong> {selectedItem.name}</p>
            <p><strong>Description:</strong> {selectedItem.description || "N/A"}</p>
            <p><strong>Price:</strong> Rs. {selectedItem.price}</p>
            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItem;
