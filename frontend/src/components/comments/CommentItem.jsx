import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import "./CommentItem.css";

function initials(firstName, lastName) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function CommentItem({ comment, postId, onCommentAdded }) {
  const [score, setScore] = useState(Number(comment.score));
  const [userVote, setUserVote] = useState(comment.user_vote);
  const [voting, setVoting] = useState(false);

  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [posting, setPosting] = useState(false);

  const [error, setError] = useState(null);

  async function vote(value) {
    if (voting) return;

    setVoting(true);
    setError(null);

    try {
      const result = await api.post(`/votes/comments/${comment.id}`, { value });
      setScore(result.score);
      setUserVote(result.userVote);
    } catch (err) {
      setError(err.message);
    } finally {
      setVoting(false);
    }
  }

  async function submitReply(event) {
    event.preventDefault();
    if (!replyBody.trim() || posting) return;

    setPosting(true);
    setError(null);

    try {
      await api.post(`/posts/${postId}/comments`, {
        content: replyBody.trim(),
        parentCommentId: comment.id,
      });
      setReplyBody("");
      setReplying(false);
      await onCommentAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="comment-item">
      <div className="comment-votes">
        <button
          type="button"
          className={`comment-vote ${userVote === 1 ? "comment-vote--up-active" : ""}`}
          onClick={() => vote(1)}
          disabled={voting}
          aria-label="Votar a favor"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5 4.8 13h4.1v6.5h6.2V13h4.1L12 4.5Z" />
          </svg>
        </button>

        <span className="comment-score">{score}</span>

        <button
          type="button"
          className={`comment-vote ${userVote === -1 ? "comment-vote--down-active" : ""}`}
          onClick={() => vote(-1)}
          disabled={voting}
          aria-label="Votar en contra"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 19.5 19.2 11h-4.1V4.5H8.9V11H4.8L12 19.5Z" />
          </svg>
        </button>
      </div>

      <div className="comment-body">
        <div className="comment-meta">
          <span className="comment-avatar">
            {initials(comment.first_name, comment.last_name)}
          </span>
          <Link className="comment-author" to={`/students/${comment.academic_registration}`}>
            {comment.first_name} {comment.last_name}
          </Link>
          <span>·</span>
          <span>{formatDate(comment.created_at)}</span>
        </div>

        <p className="comment-content">{comment.content}</p>

        <button
          type="button"
          className="comment-reply-toggle"
          onClick={() => setReplying((prev) => !prev)}
        >
          {replying ? "Cancelar" : "Responder"}
        </button>

        {error && <p className="comment-error">{error}</p>}

        {replying && (
          <form className="comment-reply-form" onSubmit={submitReply}>
            <textarea
              className="comment-reply-input"
              placeholder="Escribe una respuesta…"
              value={replyBody}
              onChange={(event) => setReplyBody(event.target.value)}
              rows={2}
            />
            <button type="submit" className="comment-reply-submit" disabled={posting}>
              Responder
            </button>
          </form>
        )}

        {comment.children.length > 0 && (
          <div className="comment-children">
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                postId={postId}
                onCommentAdded={onCommentAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
