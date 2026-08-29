import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTicket, getComments } from "../api/ticketApi";
import type { Ticket, Comment } from "../types/ticket";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import StatusSelector from "../components/StatusSelector";
import AgentAssigner from "../components/AgentAssigner";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTicket() {
      if (!id) return;

      try {
        const ticketId = Number(id);
        const [ticketData, commentData] = await Promise.all([
          getTicket(ticketId),
          getComments(ticketId),
        ]);

        setTicket(ticketData);
        setComments(commentData);
      } catch {
        setError("Unable to load ticket");
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [id]);

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  if (error || !ticket) {
    return (
      <div>
        <p>{error || "Ticket not found"}</p>
        <Link to="/tickets">Back to tickets</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/tickets">← Back to tickets</Link>

      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <hr />

      <h3>Ticket Information</h3>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Priority:</strong> {ticket.priority}</p>
      <p><strong>Category:</strong> {ticket.category?.name ?? ticket.category_id}</p>
      <p><strong>Created by:</strong> {ticket.created_by?.username ?? ticket.created_by_id}</p>
      <p><strong>Assigned to:</strong> {ticket.assigned_to?.username ?? "Unassigned"}</p>

      {/* Role-based action controls */}
      <StatusSelector 
        ticket={ticket} 
        user={user} 
        onStatusUpdated={setTicket} 
      />

      <AgentAssigner 
        ticket={ticket} 
        user={user} 
        onAgentAssigned={setTicket} 
      />

      <hr />

      {/* Comments Section */}
      <CommentSection ticketId={ticket.id} initialComments={comments} />
    </div>
  );
}