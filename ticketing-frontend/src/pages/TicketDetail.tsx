import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getTicket,
  getComments,
  createComment,
  updateTicketStatus,
  assignTicket,
} from "../api/ticketApi";

import type {
  Ticket,
  Comment,
  TicketStatus,
} from "../types/ticket";

import { useAuth } from "../context/AuthContext";
import { getAgents } from "../api/userApi";
import type { User } from "../types/auth";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [commentText, setCommentText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [statusLoading, setStatusLoading] =
    useState(false);

  const [agents, setAgents] =
    useState<User[]>([]);

  const [selectedAgent, setSelectedAgent] =
    useState("");

  useEffect(() => {
    async function loadTicket() {
      if (!id) return;

      try {
        const ticketId = Number(id);

        const [ticketData, commentData] =
          await Promise.all([
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

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      return;
    }

    async function loadAgents() {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch {
        setError(
          "Unable to load agents"
        );
      }
    }

    loadAgents();
  }, [user]);

  async function handleAddComment() {
    if (!id || !commentText.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const newComment =
        await createComment(
          Number(id),
          commentText.trim()
        );

      setComments((current) => [
        ...current,
        newComment,
      ]);

      setCommentText("");
    } catch {
      setError("Unable to add comment");
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleStatusChange(
    status: TicketStatus
  ) {
    if (!ticket) return;

    try {
      setStatusLoading(true);

      const updated =
        await updateTicketStatus(
          ticket.id,
          status
        );

      setTicket(updated);
    } catch {
      setError(
        "Unable to update ticket status"
      );
    } finally {
      setStatusLoading(false);
    }
  }

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  if (!ticket) {
    return (
      <div>
        <p>
          {error || "Ticket not found"}
        </p>

        <Link to="/tickets">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/tickets">
        ← Back to tickets
      </Link>

      <h1>{ticket.title}</h1>

      <p>{ticket.description}</p>

      <hr />

      <h3>Ticket Information</h3>

      <p>
        <strong>Status:</strong>{" "}
        {ticket.status}
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        {ticket.priority}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {ticket.category?.name ??
          ticket.category_id}
      </p>

      <p>
        <strong>Created by:</strong>{" "}
        {ticket.created_by?.username ??
          ticket.created_by_id}
      </p>

      <p>
        <strong>Assigned to:</strong>{" "}
        {ticket.assigned_to?.username ??
          "Unassigned"}
      </p>

      {user &&
        (user.role === "AGENT" ||
          user.role === "ADMIN") && (
          <div>
            <label>
              Change Status
            </label>

            <select
              value={ticket.status}
              disabled={statusLoading}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as TicketStatus
                )
              }
            >
              <option value="OPEN">
                Open
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="RESOLVED">
                Resolved
              </option>

              <option value="CLOSED">
                Closed
              </option>
            </select>
          </div>
        )}

      {user?.role === "ADMIN" && (
        <div>
          <label>
            Assign Agent
          </label>

          <select
            value={
              selectedAgent ||
              ticket.assigned_to_id ||
              ""
            }
            onChange={async (e) => {
              const agentId = Number(
                e.target.value
              );

              if (!agentId) return;

              try {
                const updated =
                  await assignTicket(
                    ticket.id,
                    agentId
                  );

                setTicket(updated);
                setSelectedAgent(
                  String(agentId)
                );
              } catch {
                setError(
                  "Unable to assign agent"
                );
              }
            }}
          >
            <option value="">
              Select agent
            </option>

            {agents.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
              >
                {agent.username}
              </option>
            ))}
          </select>
        </div>
      )}

      <hr />

      <h2>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <strong>
              {comment.user?.username ??
                `User ${comment.user_id}`}
            </strong>

            <p>{comment.content}</p>

            <small>
              {new Date(
                comment.created_at
              ).toLocaleString()}
            </small>

            <hr />
          </div>
        ))
      )}

      <h3>Add Comment</h3>

      <textarea
        value={commentText}
        onChange={(e) =>
          setCommentText(e.target.value)
        }
        placeholder="Write a comment..."
        rows={4}
      />

      <br />

      <button
        onClick={handleAddComment}
        disabled={
          commentLoading ||
          !commentText.trim()
        }
      >
        {commentLoading
          ? "Adding..."
          : "Add Comment"}
      </button>
    </div>
  );
}