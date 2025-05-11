import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import HomeLayout from "../home/HomeLayout";
import Login from "../auth/Login";
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import AdminCategory from "../admin/category/AdminCategory";
import AdminItem from "../admin/item/AdminItem";
import AdminAddItem from "../admin/item/AdminAddItem";
import AdminEditItem from "../admin/item/AdminEditItem";
const MyRouter = () => {
    const router = createBrowserRouter([

        {
            path: "/login",
            element: <Login />
        },

        {
            path: "/",
            element: <HomeLayout />,
            children: [
                {
                    path: "/",
                    element: <h1 className="text-2xl text-black">Hello</h1>
                }
            ]
        },
        {
            path: "/admin",
            element: <AdminLayout />,
            children: [
                {
                    path: '/admin',
                    element: <AdminDashboard />
                },
                {
                    path: '/admin/category',
                    element: <AdminCategory />
                },
                {
                    path: '/admin/item',
                    element: <AdminItem />
                }, {
                    path: "/admin/item/add",
                    element: <AdminAddItem />
                }, {
                    path: "/admin/item/edit/:id",
                    element: <AdminEditItem />
                }
            ]
        }
    ]);
    return (
        <RouterProvider router={router} />
    )
};
export default MyRouter;