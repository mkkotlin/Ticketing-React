import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/ticketApi";
import type { Ticket } from "../types/ticket";
import type { User } from "../types/auth";

export default function CustomerDashboard({ user }: { user: User }) {
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Fetch tickets in parallel
        const [openRes, resolvedRes] = await Promise.all([
          getTickets(1, 20, "OPEN"),
          getTickets(1, 20, "RESOLVED"),
        ]);
        
        // Also get IN_PROGRESS or WAITING_FOR_CUSTOMER tickets as open
        const inProgressRes = await getTickets(1, 20, "IN_PROGRESS");
        const waitingRes = await getTickets(1, 20, "WAITING_FOR_CUSTOMER");
        
        setOpenTickets([...openRes.items, ...inProgressRes.items, ...waitingRes.items]);
        
        // Also get CLOSED tickets as resolved
        const closedRes = await getTickets(1, 20, "CLOSED");
        setResolvedTickets([...resolvedRes.items, ...closedRes.items]);
      } catch {
        setError("Unable to load dashboard tickets");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const openCount = openTickets.filter(t => t.status === "OPEN").length;
  const inProgressCount = openTickets.filter(t => t.status === "IN_PROGRESS" || t.status === "WAITING_FOR_CUSTOMER").length;
  const resolvedCount = resolvedTickets.length;

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Welcome, {user.username}!</h1>
        <Link to="/tickets/new">
          <button style={{ padding: "10px 20px" }}>+ Create Ticket</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : error ? (
        <p style={{ color: "var(--danger-color)" }}>{error}</p>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#6366f1" }}>{openCount}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Open</div>
            </div>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{inProgressCount}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>In Progress</div>
            </div>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981" }}>{resolvedCount}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Resolved</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Open Tickets Card */}
          <div style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
              My Open Tickets ({openTickets.length})
            </h2>
            {openTickets.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No open tickets.</p>
            ) : (
              <ul style={{ margin: 0 }}>
                {openTickets.map((ticket) => (
                  <li key={ticket.id} style={{ padding: "12px", marginBottom: "10px", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link to={`/tickets/${ticket.id}`} style={{ fontWeight: 600 }}>{ticket.title}</Link>
                      <span style={{ fontSize: "0.8rem", padding: "4px 8px", borderRadius: "4px", backgroundColor: "#312e81", color: "#a5b4fc" }}>
                        {ticket.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                      Priority: {ticket.priority} | Created: {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Resolved Tickets Card */}
          <div style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
              Resolved Tickets ({resolvedTickets.length})
            </h2>
            {resolvedTickets.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No resolved tickets.</p>
            ) : (
              <ul style={{ margin: 0 }}>
                {resolvedTickets.map((ticket) => (
                  <li key={ticket.id} style={{ padding: "12px", marginBottom: "10px", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link to={`/tickets/${ticket.id}`} style={{ fontWeight: 600 }}>{ticket.title}</Link>
                      <span style={{ fontSize: "0.8rem", padding: "4px 8px", borderRadius: "4px", backgroundColor: "#065f46", color: "#6ee7b7" }}>
                        {ticket.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                      Priority: {ticket.priority} | Created: {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
