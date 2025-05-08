import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const HomeLayout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/login")
    }, [])
    return (
        <>
            <Outlet />
        </>
    )
}

export default HomeLayout