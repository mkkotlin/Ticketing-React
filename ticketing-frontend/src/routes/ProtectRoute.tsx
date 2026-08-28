import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectRoute(){
    const { user, loading} = useAuth()
    if (loading) {
        return <p>oading...</p>
    } 
    if (!user){
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}