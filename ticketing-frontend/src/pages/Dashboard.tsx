import { useAuth } from "../context/AuthContext"




export default function Dashboard() {
    const { user } = useAuth()


    switch (user?.role) {
        case "ADMIN":
            return <>
                <div style={{ padding: "20px" }}>
                    <h1>
                        {user?.username}
                        <sup style={{ fontSize: "0.4em", marginLeft: "6px", color: "#ef4444", verticalAlign: "super" }}>
                            Admin
                        </sup>{" "}
                        Dashboard
                    </h1>
                    <p>Welcome to the Administrator panel. You have full access to manage users, configurations, and all tickets.</p>
                </div>
            </>
        case "AGENT":
            return <>
                <div style={{ padding: "20px" }}>
                    <h1>
                        {user?.username}
                        <sup style={{ fontSize: "0.4em", marginLeft: "6px", color: "#f59e0b", verticalAlign: "super" }}>
                            Agent
                        </sup>{" "}
                        Dashboard
                    </h1>
                    <p>Welcome to the Agent panel. You can manage and update tickets assigned to you.</p>
                </div>
            </>
        case "CUSTOMER":
        default:
            return <>
                <div style={{ padding: "20px" }}>
                    <h1>
                        {user?.username}
                        <sup style={{ fontSize: "0.4em", marginLeft: "6px", color: "#10b981", verticalAlign: "super" }}>
                            Customer
                        </sup>{" "}
                        Dashboard
                    </h1>
                    <p>Welcome to the Customer Support portal. Here you can submit new tickets and track your existing ones.</p>
                </div>
            </>
    }
}