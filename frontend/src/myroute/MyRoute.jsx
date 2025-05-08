import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import HomeLayout from "../home/HomeLayout";
import Login from "../auth/Login";
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
                    element: <>Inside admin</>
                }
            ]
        }
    ]);
    return (
        <RouterProvider router={router} />
    )
};
export default MyRouter;