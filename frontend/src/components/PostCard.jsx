import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Share2 } from 'lucide-react';
import { api } from '../api/client.js';
import './PostCard.css';

const AREA_COLORS = {
  metodologia: 'var(--area-metodologia)',
  desarrollo: 'var(--area-desarrollo)',
  ciencias: 'var(--area-ciencias)',
};

function initials(firstName, lastName) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function PostCard({ post }) {
  const [score, setScore] = useState(Number(post.score));
  const [userVote, setUserVote] = useState(post.user_vote);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [shared, setShared] = useState(false);

  const areaColor = AREA_COLORS[post.course_area] ?? 'var(--neutral-200)';

  async function vote(value) {
    if (voting) return;

    setVoting(true);
    setError(null);

    try {
      const result = await api.post(`/votes/posts/${post.id}`, { value });
      setScore(result.score);
      setUserVote(result.userVote);
    } catch (err) {
      setError(err.message);
    } finally {
      setVoting(false);
    }
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setError('No se pudo copiar el enlace.');
    }
  }

  return (
    <article className="post-card">
      <div className="post-area-strip" style={{ background: areaColor }} />

      <div className="post-votes">
        <button
          type="button"
          className={`post-vote ${userVote === 1 ? 'post-vote--up-active' : ''}`}
          onClick={() => vote(1)}
          disabled={voting}
          aria-label="Votar a favor"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5 4.8 13h4.1v6.5h6.2V13h4.1L12 4.5Z" />
          </svg>
        </button>

        <span className="post-score">{score}</span>

        <button
          type="button"
          className={`post-vote ${userVote === -1 ? 'post-vote--down-active' : ''}`}
          onClick={() => vote(-1)}
          disabled={voting}
          aria-label="Votar en contra"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 19.5 19.2 11h-4.1V4.5H8.9V11H4.8L12 19.5Z" />
          </svg>
        </button>
      </div>

      <div className="post-body">
        <div className="post-meta">
          <span className="post-avatar">{initials(post.first_name, post.last_name)}</span>
          <Link className="post-author" to={`/students/${post.academic_registration}`}>
            {post.first_name} {post.last_name}
          </Link>
          <span>·</span>
          <span>{post.academic_registration}</span>
          <span>·</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <div className="post-badges">
          <span className="post-badge-course">
            <span className="post-badge-area" style={{ background: areaColor }} />
            {post.course_code} · {post.course_name}
          </span>
          {post.professor_name && (
            <span className="post-badge-professor">{post.professor_name}</span>
          )}
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>

        <div className="post-actions">
          <Link className="post-action" to={`/posts/${post.id}`}>
            <MessageCircle size={15} strokeWidth={2} />
            <span>
              {post.comment_count} {Number(post.comment_count) === 1 ? 'comentario' : 'comentarios'}
            </span>
          </Link>

          <button type="button" className="post-action" onClick={share}>
            <Share2 size={15} strokeWidth={2} />
            <span>{shared ? 'Enlace copiado' : 'Compartir'}</span>
          </button>
        </div>

        {error && <p className="post-error">{error}</p>}
      </div>
    </article>
  );
}

export default PostCard;
