import React from 'react';
import { Eye } from 'lucide-react';
import { useFetchOrders } from '../../../apis/order/OrderApi';
import { useTotalUsers } from "../../../apis/auth/TotalUserApi";
import Loader from '../../../components/loader/Loader';

const AdminDashboard = () => {
    // Fetch data
    const { data: totalUsers, isLoading: isLoadingUsers, error: userError } = useTotalUsers();
    const { data: orders, isLoading: isLoadingOrders, error: orderError } = useFetchOrders();

    // If loading, show loader
    if (isLoadingUsers || isLoadingOrders) {
        return <Loader />;
    }

    // If error, handle it
    if (userError || orderError) {
        return <div>Error loading data</div>;
    }

    const stats = {
        totalUsers: totalUsers?.length || 0,
        totalWorkers: totalUsers?.filter(user => user.role === 'worker').length || 0,
        totalUsers: totalUsers.filter(user => user.role === 'user').length || 0,
        totalOrders: orders?.length || 0,
        pendingOrders: orders?.filter(order => order.status === 'pending').length || 0,
        completedOrders: orders?.filter(order => order.status === 'completed').length || 0,
        totalSales: orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0,
    };

    console.log("Orders", orders);
    return (
        <div className="p-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Users Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Total Users</h2>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-600">Total Workers: <span className="font-medium">{stats.totalWorkers}</span></p>
                        <p className="text-gray-600">Total Customers: <span className="font-medium">{stats.totalUsers}</span></p>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Total Orders</h2>
                    <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-600">Pending Orders: <span className="font-medium">{stats.pendingOrders}</span></p>
                        <p className="text-gray-600">Completed Orders: <span className="font-medium">{stats.completedOrders}</span></p>
                    </div>
                </div>

                {/* Total Sales Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">Total Sales</h2>
                    <p className="text-3xl font-bold text-purple-600">NRS {stats.totalSales.toLocaleString()}</p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                                <th className="px-4 py-2 text-left text-gray-600">Status</th>
                                <th className="px-4 py-2 text-left text-gray-600">Total Price</th>
                                <th className="px-4 py-2 text-left text-gray-600">User</th>
                                <th className="px-4 py-2 text-left text-gray-600">Total Items</th>
                                <th className="px-4 py-2 text-left text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(orders && orders.length > 0) ? (orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{order.id}</td>
                                    <td className="px-4 py-2">{order.name}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">NRS {order?.total_price?.toLocaleString()}</td>
                                    <td className="px-4 py-2">{order.user}</td>
                                    <td className="px-4 py-2">{order?.order_items?.length}</td>
                                    <td className="px-4 py-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))) : (<td>Not found</td>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;