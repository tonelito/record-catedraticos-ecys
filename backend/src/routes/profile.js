import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { fetchCurriculum } from '../lib/curriculum.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const SALT_ROUNDS = 10;
const VALID_STATUSES = ['aprobado', 'cursando', 'pendiente'];

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await query(
      `
      select
        st.id,
        st.academic_registration,
        st.dpi,
        st.first_name,
        st.last_name,
        st.email,
        st.created_at,
        coalesce(sum(c.credits) filter (where scs.status = 'aprobado'), 0) as approved_credits
      from student st
      left join student_course_status scs on scs.student_id = st.id
      left join course c on c.code = scs.course_code
      where st.id = $1
      group by st.id
      `,
      [req.student.id]
    );

    res.json(result.rows[0]);
  })
);

router.patch(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, currentPassword } = req.body;

    // Cambiar correo o contraseña exige volver a probar quién sos. Sin esto,
    // una sesión abierta y olvidada le alcanzaría a cualquiera para cambiar la
    // contraseña y dejar al dueño fuera de su propia cuenta.
    if (!currentPassword) {
      return res.status(400).json({ error: 'Se requiere la contraseña actual.' });
    }

    const account = await query(`select password_hash from student where id = $1`, [
      req.student.id,
    ]);

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      account.rows[0].password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: 'La contraseña actual no es correcta.' });
    }

    const fields = [];
    const values = [];

    if (firstName) {
      values.push(firstName);
      fields.push(`first_name = $${values.length}`);
    }
    if (lastName) {
      values.push(lastName);
      fields.push(`last_name = $${values.length}`);
    }
    if (email) {
      values.push(email);
      fields.push(`email = $${values.length}`);
    }
    if (password) {
      values.push(await bcrypt.hash(password, SALT_ROUNDS));
      fields.push(`password_hash = $${values.length}`);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No se envió ningún campo para actualizar.' });
    }

    values.push(req.student.id);

    try {
      const result = await query(
        `update student set ${fields.join(', ')}
         where id = $${values.length}
         returning id, academic_registration, dpi, first_name, last_name, email, created_at`,
        values
      );
      res.json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ese correo ya está en uso.' });
      }
      throw err;
    }
  })
);

router.get(
  '/courses',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await fetchCurriculum(req.student.id));
  })
);

router.put(
  '/courses/:code',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { code } = req.params;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status debe ser uno de: ${VALID_STATUSES.join(', ')}.` });
    }

    if (status === 'pendiente') {
      await query(
        `delete from student_course_status where student_id = $1 and course_code = $2`,
        [req.student.id, code]
      );
      return res.json({ code, status: 'pendiente' });
    }

    try {
      await query(
        `insert into student_course_status (student_id, course_code, status)
         values ($1, $2, $3)
         on conflict (student_id, course_code) do update set status = excluded.status`,
        [req.student.id, code, status]
      );
      res.json({ code, status });
    } catch (err) {
      if (err.code === '23503') {
        return res.status(404).json({ error: 'El curso no existe.' });
      }
      throw err;
    }
  })
);

export default router;
