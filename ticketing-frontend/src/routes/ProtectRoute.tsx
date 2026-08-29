import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function ProtectRoute(){
    const { user, loading} = useAuth()
    if (loading) {
        return <p>Loading...</p>
    } 
    if (!user){
        return <Navigate to="/login" replace />
    }
    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <Outlet />
            </div>
        </div>
    )
}