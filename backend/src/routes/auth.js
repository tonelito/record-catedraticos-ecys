import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';

const router = Router();
const SALT_ROUNDS = 10;

function signToken(student) {
  return jwt.sign({ sub: student.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { academicRegistration, dpi, firstName, lastName, email, password } = req.body;

    if (!academicRegistration || !dpi || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const result = await query(
        `insert into student (academic_registration, dpi, first_name, last_name, email, password_hash)
         values ($1, $2, $3, $4, $5, $6)
         returning id, academic_registration, first_name, last_name, email`,
        [academicRegistration, dpi, firstName, lastName, email, passwordHash]
      );

      const student = result.rows[0];
      res.status(201).json({ student, token: signToken(student) });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un estudiante con ese registro, DPI o correo.' });
      }
      throw err;
    }
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const result = await query(
      `select id, academic_registration, first_name, last_name, email, password_hash
       from student
       where academic_registration = $1 or dpi = $1`,
      [identifier]
    );

    const student = result.rows[0];
    if (!student) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordMatches = await bcrypt.compare(password, student.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    delete student.password_hash;
    res.json({ student, token: signToken(student) });
  })
);

export default router;
