import React, { useState } from "react";
import { Edit, Trash, X, Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

import {
  useFetchWorkers,
  fetchWorkerById,
  useCreateWorker
} from "../../../apis/worker/WorkerApi";

const WorkerModal = ({ isOpen, onClose, onSubmit, worker, setWorker, isEditing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditing ? "Edit Worker" : "Add Worker"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {['name', 'email', 'password'].map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium text-sm text-gray-700">
                Worker {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                value={worker[field] || ''}
                onChange={(e) => setWorker({ ...worker, [field]: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewWorkerModal = ({ worker, onClose }) => {
  if (!worker) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Worker Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          <p><strong>ID:</strong> {worker.id}</p>
          <p><strong>Name:</strong> {worker.name}</p>
          <p><strong>Email:</strong> {worker.email}</p>
          <p><strong>Role:</strong> {worker.role}</p>
        </div>
      </div>
    </div>
  );
};

const AdminWorker = () => {
  const token = Cookies.get("token");
  const { data: workers = [], isLoading, isError } = useFetchWorkers(token);
  const { mutateAsync: createWorkerMutator } = useCreateWorker();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [worker, setWorker] = useState({ name: "", email: "", password: "", role: "worker" });
  const [viewingWorker, setViewingWorker] = useState(null);

  const handleView = async (id) => {
    try {
      const data = await fetchWorkerById(id);
      setViewingWorker(data);
    } catch (error) {
      toast.error("Failed to fetch worker details");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorker(null);
    setWorker({ name: "", email: "", password: "", role: "worker" });
    setViewingWorker(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createWorkerMutator(worker);
        console.log(res)
        toast.success("Worker account created successfully");
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message?.email[0] || "Failed to create worker");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Workers <span className="bg-green-100 text-green-800 text-sm font-medium ml-2 px-3 py-1 rounded-full">{workers.length}</span>
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Add Worker
        </button>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded w-full"></div>)}
        </div>
      )}

      {isError && (
        <div className="text-red-600 bg-red-100 p-4 rounded-lg">
          Failed to load workers. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                {['ID', 'Name', 'Email', 'Actions'].map((heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-sm font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.length > 0 ? (
                workers.map((worker, index) => (
                  <tr
                    key={worker.id}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-700">{worker.name}</td>
                    <td className="px-6 py-4 text-gray-700">{worker.email}</td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button onClick={() => handleView(worker.id)} className="text-green-600 hover:text-green-800">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No workers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <WorkerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        worker={worker}
        setWorker={setWorker}
        isEditing={!!editingWorker}
      />

      <ViewWorkerModal worker={viewingWorker} onClose={handleCloseModal} />
    </div>
  );
};

export default AdminWorker;