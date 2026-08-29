import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/ticketApi";
import type { Ticket } from "../types/ticket";
import type { User } from "../types/auth";

export default function AgentDashboard({ user }: { user: User }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAgentTickets() {
      try {
        setLoading(true);
        // Since backend already filters /tickets for AGENT role automatically, we fetch all
        const res = await getTickets(1, 100);
        setTickets(res.items);
      } catch {
        setError("Unable to load assigned tickets");
      } finally {
        setLoading(false);
      }
    }

    loadAgentTickets();
  }, []);

  const openTickets = tickets.filter(t => t.status === "OPEN");
  const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS" || t.status === "WAITING_FOR_CUSTOMER");
  const resolvedTickets = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED");

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Agent Portal</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Logged in as agent: <strong>{user.username}</strong></p>
        </div>
        <Link to="/tickets/new">
          <button style={{ padding: "10px 20px" }}>+ Create Ticket</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading assigned tickets...</p>
      ) : error ? (
        <p style={{ color: "var(--danger-color)" }}>{error}</p>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#6366f1" }}>{openTickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Open Tickets</div>
            </div>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{inProgressTickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>In Progress</div>
            </div>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981" }}>{resolvedTickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Resolved / Closed</div>
            </div>
          </div>

          {/* Assigned Tickets Lists */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
                Active Queue ({openTickets.length + inProgressTickets.length})
              </h2>
              {[...openTickets, ...inProgressTickets].length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>Your queue is empty!</p>
              ) : (
                <ul style={{ margin: 0 }}>
                  {[...openTickets, ...inProgressTickets].map((ticket) => (
                    <li key={ticket.id} style={{ padding: "12px", marginBottom: "10px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Link to={`/tickets/${ticket.id}`} style={{ fontWeight: 600 }}>{ticket.title}</Link>
                        <span style={{ 
                          fontSize: "0.75rem", 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          backgroundColor: ticket.status === "OPEN" ? "#312e81" : "#78350f",
                          color: ticket.status === "OPEN" ? "#a5b4fc" : "#fde68a"
                        }}>
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

            <div style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
                Resolved / Archive ({resolvedTickets.length})
              </h2>
              {resolvedTickets.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>No resolved tickets.</p>
              ) : (
                <ul style={{ margin: 0 }}>
                  {resolvedTickets.map((ticket) => (
                    <li key={ticket.id} style={{ padding: "12px", marginBottom: "10px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Link to={`/tickets/${ticket.id}`} style={{ fontWeight: 600 }}>{ticket.title}</Link>
                        <span style={{ fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#065f46", color: "#6ee7b7" }}>
                          {ticket.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                        Priority: {ticket.priority} | Resolved
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
