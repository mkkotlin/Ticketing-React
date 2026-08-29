import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTicket } from "../api/ticketApi";
import type { TicketPriority } from "../types/ticket";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TicketPriority>("MEDIUM");

  const [categoryId, setCategoryId] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const ticket = await createTicket({
        title,
        description,
        priority,
        category_id: Number(categoryId),
      });

      navigate(`/tickets/${ticket.id}`);
    } catch {
      setError("Unable to create ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Create Ticket</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Priority</label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value as TicketPriority
              )
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label>Category ID</label>

          <input
            type="number"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}