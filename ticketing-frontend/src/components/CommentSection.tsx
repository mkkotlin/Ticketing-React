import { useState } from "react";
import { createComment } from "../api/ticketApi";
import type { Comment } from "../types/ticket";

interface CommentSectionProps {
  ticketId: number;
  initialComments: Comment[];
}

export default function CommentSection({ ticketId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      setError("");
      const newComment = await createComment(ticketId, commentText.trim());
      setComments((current) => [...current, newComment]);
      setCommentText("");
    } catch {
      setError("Unable to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {error && <p className="error-message" style={{ color: "var(--danger-color)" }}>{error}</p>}
      
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment-item" style={{ marginBottom: "16px" }}>
            <strong>
              {comment.user?.username ?? `User ${comment.user_id}`}
            </strong>
            <p style={{ margin: "4px 0" }}>{comment.content}</p>
            <small style={{ color: "var(--text-muted)" }}>
              {new Date(comment.created_at).toLocaleString()}
            </small>
            <hr style={{ borderColor: "var(--border-color)", margin: "12px 0 0 0" }} />
          </div>
        ))
      )}

      <h3 style={{ marginTop: "24px" }}>Add Comment</h3>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button
        onClick={handleAddComment}
        disabled={commentLoading || !commentText.trim()}
      >
        {commentLoading ? "Adding..." : "Add Comment"}
      </button>
    </div>
  );
}
