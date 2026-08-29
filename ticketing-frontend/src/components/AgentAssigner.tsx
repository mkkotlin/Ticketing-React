import { useEffect, useState } from "react";
import { getAgents } from "../api/userApi";
import { assignTicket } from "../api/ticketApi";
import type { Ticket } from "../types/ticket";
import type { User } from "../types/auth";

interface AgentAssignerProps {
  ticket: Ticket;
  user: User | null;
  onAgentAssigned: (updatedTicket: Ticket) => void;
}

export default function AgentAssigner({ ticket, user, onAgentAssigned }: AgentAssignerProps) {
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      return;
    }

    async function loadAgents() {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch {
        setError("Unable to load agents");
      }
    }

    loadAgents();
  }, [user]);

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div style={{ margin: "16px 0" }}>
      <label style={{ display: "block", marginBottom: "6px" }}>
        Assign Agent
      </label>

      <select
        value={selectedAgent || ticket.assigned_to_id || ""}
        onChange={async (e) => {
          const agentId = Number(e.target.value);
          if (!agentId) return;

          try {
            setError("");
            const updated = await assignTicket(ticket.id, agentId);
            onAgentAssigned(updated);
            setSelectedAgent(String(agentId));
          } catch {
            setError("Unable to assign agent");
          }
        }}
      >
        <option value="">Select agent</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.username}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "var(--danger-color)", fontSize: "0.9rem", marginTop: "4px" }}>{error}</p>}
    </div>
  );
}
