import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get(
  '/:postId/comments',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const result = await query(
      `
      with recursive comment_tree as (
        select id, post_id, student_id, parent_comment_id, content, created_at, 0 as depth
        from comment
        where post_id = $1 and parent_comment_id is null

        union all

        select c.id, c.post_id, c.student_id, c.parent_comment_id, c.content, c.created_at, ct.depth + 1
        from comment c
        join comment_tree ct on c.parent_comment_id = ct.id
      )
      select
        ct.id,
        ct.parent_comment_id,
        ct.content,
        ct.created_at,
        ct.depth,
        st.id as student_id,
        st.academic_registration,
        st.first_name,
        st.last_name,
        coalesce((select sum(value) from comment_vote where comment_id = ct.id), 0) as score,
        (select value from comment_vote where comment_id = ct.id and student_id = $2) as user_vote
      from comment_tree ct
      join student st on st.id = ct.student_id
      order by ct.depth, ct.created_at
      `,
      [postId, req.student.id]
    );

    res.json(result.rows);
  })
);

router.post(
  '/:postId/comments',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Falta el contenido del comentario.' });
    }

    if (parentCommentId) {
      const parent = await query(
        `select id from comment where id = $1 and post_id = $2`,
        [parentCommentId, postId]
      );
      if (parent.rows.length === 0) {
        return res.status(400).json({ error: 'El comentario padre no pertenece a esta publicación.' });
      }
    }

    const result = await query(
      `insert into comment (post_id, student_id, parent_comment_id, content)
       values ($1, $2, $3, $4)
       returning id, post_id, parent_comment_id, content, created_at`,
      [postId, req.student.id, parentCommentId ?? null, content]
    );

    res.status(201).json(result.rows[0]);
  })
);

export default router;
