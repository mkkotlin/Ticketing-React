import { Navigate, Outlet} from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface RoleRouteProps{
    allowedRoles: string[]
}

export default function RoleRoute({allowedRoles}: RoleRouteProps){
    const { user } = useAuth()
    if (!user){
        return <Navigate to="login" replace />
    }
    if (!allowedRoles.includes(user.role)){
        return <Navigate to="/dashboard" replace />
    }
    return <Outlet />
}