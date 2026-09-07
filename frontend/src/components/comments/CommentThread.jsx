import CommentItem from "./CommentItem.jsx";
import "./CommentThread.css";

// El backend devuelve los comentarios en una lista plana (con depth y
// parent_comment_id), ordenada por nivel y no por hilo. Antes de dibujarlos
// hay que reconstruir el árbol real, o las respuestas de distintos hilos
// quedarían mezcladas entre sí.
function buildTree(comments) {
  const byId = new Map();
  comments.forEach((comment) => byId.set(comment.id, { ...comment, children: [] }));

  const roots = [];

  byId.forEach((comment) => {
    if (comment.parent_comment_id === null) {
      roots.push(comment);
      return;
    }

    const parent = byId.get(comment.parent_comment_id);
    if (parent) parent.children.push(comment);
  });

  return roots;
}

function CommentThread({ comments, postId, onCommentAdded }) {
  const tree = buildTree(comments);

  if (tree.length === 0) {
    return (
      <p className="comment-thread-empty">
        Todavía no hay comentarios. Sé el primero en escribir uno.
      </p>
    );
  }

  return (
    <div className="comment-thread">
      {tree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
}

export default CommentThread;
