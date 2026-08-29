import { useState } from "react";
import { updateTicketStatus } from "../api/ticketApi";
import type { Ticket, TicketStatus } from "../types/ticket";
import type { User } from "../types/auth";

interface StatusSelectorProps {
  ticket: Ticket;
  user: User | null;
  onStatusUpdated: (updatedTicket: Ticket) => void;
}

export default function StatusSelector({ ticket, user, onStatusUpdated }: StatusSelectorProps) {
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (status: TicketStatus) => {
    try {
      setStatusLoading(true);
      setError("");
      const updated = await updateTicketStatus(ticket.id, status);
      onStatusUpdated(updated);
    } catch {
      setError("Unable to update ticket status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (!user || (user.role !== "AGENT" && user.role !== "ADMIN")) {
    return null;
  }

  return (
    <div style={{ margin: "16px 0" }}>
      <label style={{ display: "block", marginBottom: "6px" }}>
        Change Status
      </label>
      <select
        value={ticket.status}
        disabled={statusLoading}
        onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
      >
        <option value="OPEN">Open</option>
        {user?.role === "AGENT" ? (
          <>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </>
        ) : (
          (ticket.status === "IN_PROGRESS" || ticket.status === "RESOLVED") && (
            <option value={ticket.status} disabled>
              {ticket.status === "IN_PROGRESS" ? "In Progress" : "Resolved"} (Current)
            </option>
          )
        )}
        <option value="CLOSED">Closed</option>
      </select>
      {error && <p style={{ color: "var(--danger-color)", fontSize: "0.9rem", marginTop: "4px" }}>{error}</p>}
    </div>
  );
}
