import { useAuth } from "../context/AuthContext"

function AdminDashboard() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the Administrator panel. You have full access to manage users, configurations, and all tickets.</p>
        </div>
    )
}

function AgentDashboard() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Agent Dashboard</h1>
            <p>Welcome to the Agent panel. You can manage, assign, and update tickets assigned to you.</p>
        </div>
    )
}

function CustomerDashboard() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Customer Dashboard</h1>
            <p>Welcome to the Customer Support portal. Here you can submit new tickets and track your existing ones.</p>
        </div>
    )
}

export default function Dashboard() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{ padding: "20px" }}>
                <p>Loading Dashboard...</p>
            </div>
        )
    }

    switch (user?.role) {
        case "ADMIN":
            return <AdminDashboard />
        case "AGENT":
            return <AgentDashboard />
        case "CUSTOMER":
        default:
            return <CustomerDashboard />
    }
}