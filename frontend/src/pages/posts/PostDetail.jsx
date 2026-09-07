import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar.jsx";
import PostCard from "../../components/feed/PostCard.jsx";
import CommentThread from "../../components/comments/CommentThread.jsx";
import { api } from "../../api/client.js";
import "./PostDetail.css";

function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentBody, setCommentBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([api.get(`/posts/${id}`), api.get(`/posts/${id}/comments`)])
      .then(([postData, commentsData]) => {
        if (ignore) return;
        setPost(postData);
        setComments(commentsData);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  async function refreshComments() {
    const data = await api.get(`/posts/${id}/comments`);
    setComments(data);
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!commentBody.trim() || posting) return;

    setPosting(true);
    setCommentError(null);

    try {
      await api.post(`/posts/${id}/comments`, { content: commentBody.trim() });
      setCommentBody("");
      await refreshComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      <AppNavbar />

      <div className="post-detail-layout">
        {loading && <p className="post-detail-note">Cargando publicación…</p>}
        {error && <p className="post-detail-error">{error}</p>}
        {post && (
          <>
            <PostCard post={post} />

            <form className="comment-composer" onSubmit={handleCommentSubmit}>
              <textarea
                className="comment-composer-input"
                placeholder="Escribe un comentario…"
                value={commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                rows={3}
              />
              {commentError && (
                <p className="post-detail-error">{commentError}</p>
              )}
              <button
                type="submit"
                className="comment-composer-submit"
                disabled={posting}
              >
                Comentar
              </button>
            </form>

            <p className="post-detail-note">
              {comments.length}{" "}
              {comments.length === 1 ? "comentario" : "comentarios"}
            </p>

            <CommentThread
              comments={comments}
              postId={id}
              onCommentAdded={refreshComments}
            />
          </>
        )}
      </div>
    </>
  );
}

export default PostDetail;
