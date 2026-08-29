import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import AgentDashboard from "../components/AgentDashboard";
import CustomerDashboard from "../components/CustomerDashboard";

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return null;

    switch (user.role) {
        case "ADMIN":
            return <AdminDashboard user={user} />;
        case "AGENT":
            return <AgentDashboard user={user} />;
        case "CUSTOMER":
        default:
            return <CustomerDashboard user={user} />;
    }
}