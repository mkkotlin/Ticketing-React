import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/ticketApi";
import api from "../api/axios";
import type { Ticket } from "../types/ticket";
import type { User } from "../types/auth";

export default function AdminDashboard({ user }: { user: User }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolvedSectionRef = useRef<HTMLDivElement>(null);

  const scrollToResolved = () => {
    resolvedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        // Admins can fetch all tickets
        const ticketsRes = await getTickets(1, 100);
        setTickets(ticketsRes.items);

        // Fetch users using GET /users
        const usersRes = await api.get<User[]>("/users");
        setUsers(usersRes.data);
      } catch {
        setError("Unable to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const openTickets = tickets.filter(t => t.status === "OPEN");
  const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS" || t.status === "WAITING_FOR_CUSTOMER");
  const resolvedTickets = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED");
  const activeTickets = tickets.filter(t => t.status !== "RESOLVED" && t.status !== "CLOSED");

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Admin Command Center</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Administrator: <strong>{user.username}</strong></p>
        </div>
        <Link to="/tickets/new">
          <button style={{ padding: "10px 20px" }}>+ Create Ticket</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading administration panel...</p>
      ) : error ? (
        <p style={{ color: "var(--danger-color)" }}>{error}</p>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#a5b4fc" }}>{tickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total Tickets</div>
            </div>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#6366f1" }}>{openTickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Open</div>
            </div>
            <div style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{inProgressTickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>In Progress</div>
            </div>
            <div 
              onClick={scrollToResolved}
              style={{ backgroundColor: "var(--card-bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "center", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981" }}>{resolvedTickets.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Resolved</div>
            </div>
          </div>

          {/* Users List & Ticket Overview */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
            {/* Active System Queue */}
            <div style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", maxHeight: "480px" }}>
              <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
                Active System Queue ({activeTickets.length})
              </h2>
              {activeTickets.length === 0 ? (
                <p style={{ color: "var(--text-muted)", margin: 0 }}>No active tickets in the system.</p>
              ) : (
                <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
                  <ul style={{ margin: 0, gap: "10px" }}>
                    {activeTickets.map((ticket) => (
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
                          Priority: {ticket.priority} | Created by: {ticket.created_by?.username ?? `User ${ticket.created_by_id}`}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Users list */}
            <div style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", maxHeight: "480px" }}>
              <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
                System Users ({users.length})
              </h2>
              <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
                <ul style={{ margin: 0, gap: "8px" }}>
                  {users.map((userItem) => (
                    <li key={userItem.id} style={{ padding: "10px", marginBottom: "8px", background: "rgba(255,255,255,0.02)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ display: "block" }}>{userItem.username}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{userItem.email}</span>
                      </div>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        padding: "2px 6px", 
                        borderRadius: "4px", 
                        backgroundColor: userItem.role === "ADMIN" ? "#7f1d1d" : userItem.role === "AGENT" ? "#1e3a8a" : "#14532d",
                        color: userItem.role === "ADMIN" ? "#fca5a5" : userItem.role === "AGENT" ? "#93c5fd" : "#86efac"
                      }}>
                        {userItem.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Resolved & Closed Archive Section */}
          <div 
            ref={resolvedSectionRef}
            style={{ backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)", marginTop: "24px", display: "flex", flexDirection: "column", maxHeight: "400px" }}
          >
            <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginTop: 0 }}>
              Resolved & Closed Tickets ({resolvedTickets.length})
            </h2>
            {resolvedTickets.length === 0 ? (
              <p style={{ color: "var(--text-muted)", margin: 0 }}>No resolved or closed tickets.</p>
            ) : (
              <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
                <ul style={{ margin: 0, gap: "10px" }}>
                  {resolvedTickets.map((ticket) => (
                    <li key={ticket.id} style={{ padding: "12px", marginBottom: "10px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Link to={`/tickets/${ticket.id}`} style={{ fontWeight: 600 }}>{ticket.title}</Link>
                        <span style={{ 
                          fontSize: "0.75rem", 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          backgroundColor: ticket.status === "RESOLVED" ? "#065f46" : "#1e293b",
                          color: ticket.status === "RESOLVED" ? "#6ee7b7" : "#cbd5e1"
                        }}>
                          {ticket.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                        Priority: {ticket.priority} | Created by: {ticket.created_by?.username ?? `User ${ticket.created_by_id}`}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
