import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useVerifyToken } from '../../apis/auth/VerifyToken';
import Roles from '../../enums/Roles';
import Loader from '../../components/loader/Loader';
import LogoutAPI from '../../apis/auth/LogoutApi';

const AdminLayout = () => {
    const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
    const { data: userData, isLoading, error } = useVerifyToken(token);
    const [admin, setAdmin] = useState({});

    const handleLogout = () => {
        LogoutAPI(token);
        Cookies.remove("token");
        setAdmin(null);
    };

    if (isLoading) {
        return <div><Loader /></div>;
    }

    if (error || !userData || userData?.role !== Roles.ADMIN) {
        return <Navigate to="/login" />;
    }

    return (
        admin ? (
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 text-white flex flex-col fixed top-0 bottom-0">
                    <div className="p-4 text-2xl font-bold border-b border-gray-700">
                        Admin Panel
                    </div>
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            <li>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `block p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/category"
                                    className={({ isActive }) =>
                                        `block p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    Category
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/item"
                                    className={({ isActive }) =>
                                        `block p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    Items
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/worker"
                                    className={({ isActive }) =>
                                        `block p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    Workers
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/order"
                                    className={({ isActive }) =>
                                        `block p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/bills"
                                    className={({ isActive }) =>
                                        `block p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    Bills
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left p-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 ml-64 p-6">
                    <Outlet />
                </div>
            </div>
        ) : (
            <Navigate to="/login" />
        )
    );
};

export default AdminLayout;