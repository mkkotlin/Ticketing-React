import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTicket } from "../api/ticketApi";
import { getCategories } from "../api/categoryApi";
import type { TicketPriority, Category } from "../types/ticket";

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

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch {
        setError(
          "Unable to load categories"
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

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
          <label>Category</label>

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            required
            disabled={categoriesLoading}
          >
            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : "Select category"}
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {!categoriesLoading &&
          categories.length === 0 && (
            <p style={{ color: "var(--danger-color)" }}>
              No categories available.
            </p>
          )}

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={
            loading ||
            categoriesLoading ||
            categories.length === 0
          }
        >
          {loading
            ? "Creating..."
            : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}