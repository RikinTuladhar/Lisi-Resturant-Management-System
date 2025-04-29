import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Order',
            href: '/order',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="w-full max-w-2xl bg-[#171717] p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-center mb-6">Create Category</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">Category Name</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-red-400 text-sm mt-2">{errors.name}</div>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                        >
                            Add Category
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
