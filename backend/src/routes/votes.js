import { Router } from 'express';
import { pool } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// `table` y `targetColumn` siempre vienen escritos a mano abajo en este mismo
// archivo (nunca desde req.body/req.params), así que interpolarlos en el SQL
// es seguro — no es una entrada del usuario, es una de dos constantes fijas.
async function castVote({ table, targetColumn, targetId, studentId, value }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existing = await client.query(
      `select value from ${table} where student_id = $1 and ${targetColumn} = $2 for update`,
      [studentId, targetId]
    );

    let userVote;

    if (existing.rows.length === 0) {
      await client.query(
        `insert into ${table} (student_id, ${targetColumn}, value) values ($1, $2, $3)`,
        [studentId, targetId, value]
      );
      userVote = value;
    } else if (existing.rows[0].value === value) {
      await client.query(
        `delete from ${table} where student_id = $1 and ${targetColumn} = $2`,
        [studentId, targetId]
      );
      userVote = null;
    } else {
      await client.query(
        `update ${table} set value = $3 where student_id = $1 and ${targetColumn} = $2`,
        [studentId, targetId, value]
      );
      userVote = value;
    }

    const scoreResult = await client.query(
      `select coalesce(sum(value), 0) as score from ${table} where ${targetColumn} = $1`,
      [targetId]
    );

    await client.query('COMMIT');
    return { userVote, score: Number(scoreResult.rows[0].score) };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

function validateValue(req, res) {
  const { value } = req.body;
  if (value !== 1 && value !== -1) {
    res.status(400).json({ error: 'value debe ser 1 o -1.' });
    return null;
  }
  return value;
}

router.post(
  '/posts/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const value = validateValue(req, res);
    if (value === null) return;

    try {
      const result = await castVote({
        table: 'post_vote',
        targetColumn: 'post_id',
        targetId: req.params.id,
        studentId: req.student.id,
        value,
      });
      res.json(result);
    } catch (err) {
      if (err.code === '23503') {
        return res.status(404).json({ error: 'La publicación no existe.' });
      }
      throw err;
    }
  })
);

router.post(
  '/comments/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const value = validateValue(req, res);
    if (value === null) return;

    try {
      const result = await castVote({
        table: 'comment_vote',
        targetColumn: 'comment_id',
        targetId: req.params.id,
        studentId: req.student.id,
        value,
      });
      res.json(result);
    } catch (err) {
      if (err.code === '23503') {
        return res.status(404).json({ error: 'El comentario no existe.' });
      }
      throw err;
    }
  })
);

export default router;
