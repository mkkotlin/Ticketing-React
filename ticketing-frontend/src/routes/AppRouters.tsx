import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Tickets from "../pages/Tickets"
import TicketDetail from "../pages/TicketDetail"
import NotFound from "../pages/NotFound"
import ProtectedRoute from "./ProtectRoute"
import RoleRoute from "./RoleRoute"
import CreateTicket from "../pages/CreateTicket";

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                {/* Public access */}
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />

                {/* Authentication required */}
                <Route element={<ProtectedRoute />} >
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/tickets" element={<Tickets/>} />
                    <Route path="/tickets/:id" element={<TicketDetail/>} />
                    <Route path="/tickets/new" element={<CreateTicket />} />
                    {/* Admin */}
                    <Route element={ <RoleRoute allowedRoles={["ADMIN"]}/>}>
                    {/* Admin page here */}
                    </Route>
                    {/* Agent */}
                    <Route element={<RoleRoute allowedRoles={["AGENT", "ADMIN"]}/>}>
                    {/* agent page here */}
                    </Route>
                </Route>
                    <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}