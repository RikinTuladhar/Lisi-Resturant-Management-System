import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'
import VerifyToken from '../../apis/auth/VerifyToken'
const AdminLayout = ({ children }) => {
    const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
    const [admin, setAdmin] = useState({});
    useEffect(() => {
        (async () => {
            const res = await VerifyToken(token)
            if (res?.role !== "admin") {
                setAdmin(null)
                Cookies.remove("token");
                return
            }
            setAdmin(res)
        })()
    }, [])


    return (
        admin ? <Outlet /> : <Navigate to={"/login"} />
    )
}

export default AdminLayout