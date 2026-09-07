import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { courseCode, professorId, studentId } = req.query;

    const result = await query(
      `
      select
        p.id,
        p.title,
        p.content,
        p.created_at,
        c.code as course_code,
        c.name as course_name,
        c.area as course_area,
        p.professor_id,
        pr.complete_name as professor_name,
        st.id as student_id,
        st.academic_registration,
        st.first_name,
        st.last_name,
        coalesce(stats.score, 0) as score,
        coalesce(stats.comment_count, 0) as comment_count,
        uv.value as user_vote
      from post p
      join course c on c.code = p.course_code
      left join professor pr on pr.id = p.professor_id
      join student st on st.id = p.student_id
      left join lateral (
        select
          (select sum(value) from post_vote where post_id = p.id) as score,
          (select count(*) from comment where post_id = p.id) as comment_count
      ) stats on true
      left join post_vote uv on uv.post_id = p.id and uv.student_id = $1
      where ($2::char(4) is null or p.course_code = $2)
        and ($3::int is null or p.professor_id = $3)
        and ($4::int is null or p.student_id = $4)
      order by p.created_at desc
      `,
      [req.student.id, courseCode ?? null, professorId ?? null, studentId ?? null]
    );

    res.json(result.rows);
  })
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await query(
      `
      select
        p.id,
        p.title,
        p.content,
        p.created_at,
        c.code as course_code,
        c.name as course_name,
        c.area as course_area,
        p.professor_id,
        pr.complete_name as professor_name,
        st.id as student_id,
        st.academic_registration,
        st.first_name,
        st.last_name,
        coalesce(stats.score, 0) as score,
        coalesce(stats.comment_count, 0) as comment_count,
        uv.value as user_vote
      from post p
      join course c on c.code = p.course_code
      left join professor pr on pr.id = p.professor_id
      join student st on st.id = p.student_id
      left join lateral (
        select
          (select sum(value) from post_vote where post_id = p.id) as score,
          (select count(*) from comment where post_id = p.id) as comment_count
      ) stats on true
      left join post_vote uv on uv.post_id = p.id and uv.student_id = $1
      where p.id = $2
      `,
      [req.student.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'La publicación no existe.' });
    }

    res.json(result.rows[0]);
  })
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { courseCode, professorId, title, content } = req.body;

    if (!courseCode || !title || !content) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const result = await query(
      `insert into post (student_id, course_code, professor_id, title, content)
       values ($1, $2, $3, $4, $5)
       returning id, course_code, professor_id, title, content, created_at`,
      [req.student.id, courseCode, professorId ?? null, title, content]
    );

    res.status(201).json(result.rows[0]);
  })
);

export default router;
