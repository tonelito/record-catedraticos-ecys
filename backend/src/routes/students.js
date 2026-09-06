import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
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
        coalesce(sum(c.credits) filter (where scs.status = 'aprobado'), 0) as approved_credits
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

export default router;
