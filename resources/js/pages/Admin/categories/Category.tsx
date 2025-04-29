import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import axios from 'axios';

const Category = ({ categories }) => {
    // Access the flash data (success message) from Inertia
    const { success } = usePage().props;

    // State to manage message
    const [message, setMessage] = useState<string | null>(null);

    // Effect hook to set the success message when it's available
    useEffect(() => {
        if (success) {
            setMessage(success);
        }
    }, [success]);

    const [editingCategory, setEditingCategory] = useState(null);
    const [newName, setNewName] = useState('');

    // Handle category edit trigger
    const handleEdit = (id) => {
        const cat = categories.find((c) => c.id === id);
        if (cat) {
            setEditingCategory(cat);
            setNewName(cat.name);
        }
    };

    // Save the category update
    const saveEdit = () => {
        if (editingCategory) {
            // You can replace this with an actual API call, like axios.put or use inertia.post/put.
            axios
                .put(route('categories.update', editingCategory.id), {
                    name: newName,
                })
                .then(() => {
                    alert('Category updated successfully');
                    // Refresh page or update state
                    setEditingCategory(null);
                    setNewName('');
                })
                .catch((err) => {
                    console.error(err);
                    alert('Error updating category');
                });
        }
    };

    async function handleDelete(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                // Ensure CSRF token is included in the request header
                axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                // Perform the DELETE request
                await axios.delete(route('categories.destroy', id));

                // Set the success message after deletion
                setMessage('Category deleted successfully!');
                // Optionally, refresh the page or update state
            } catch (error) {
                console.error(error);
                alert('Error deleting category');
            }
        }
    }


    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/' },
        { title: 'Categories', href: '/categories' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Management" />

            {/* Show success message if it exists */}
            {message && (
                <div className="bg-green-500 text-white p-4 rounded-md mb-4">
                    <strong>Success!</strong> {message}
                </div>
            )}

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <Link href={route('categories.create')} className="btn btn-primary">
                        Add Category
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-800">{cat.id}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{cat.name}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" onClick={() => handleEdit(cat.id)}>Edit</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Category</DialogTitle>
                                                    </DialogHeader>
                                                    <Input
                                                        value={newName}
                                                        onChange={(e) => setNewName(e.target.value)}
                                                        className="my-4"
                                                    />
                                                    <DialogFooter>
                                                        <Button onClick={saveEdit}>Save</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="destructive" onClick={() => handleDelete(cat.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default Category;
