import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { fetchCurriculum } from '../lib/curriculum.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get(
  '/:academicRegistration',
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await query(
      `
      select
        st.id,
        st.academic_registration,
        st.first_name,
        st.last_name,
        coalesce(sum(c.credits) filter (where scs.status = 'aprobado'), 0) as approved_credits,
        (select count(*) from post where student_id = st.id) as post_count,
        (select count(*) from comment where student_id = st.id) as comment_count
      from student st
      left join student_course_status scs on scs.student_id = st.id
      left join course c on c.code = scs.course_code
      where st.academic_registration = $1
      group by st.id
      `,
      [req.params.academicRegistration]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    res.json(result.rows[0]);
  })
);

// La red de estudios de otro estudiante, solo lectura (pantalla 1k).
router.get(
  '/:academicRegistration/courses',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Se busca primero al estudiante para poder responder 404 de verdad: si se
    // resolviera todo en una sola consulta, un registro inexistente devolvería
    // el pensum completo en 'pendiente' en vez de un error.
    const student = await query(
      `select id from student where academic_registration = $1`,
      [req.params.academicRegistration]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    res.json(await fetchCurriculum(student.rows[0].id));
  })
);

export default router;
