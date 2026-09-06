import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { courseCode } = req.query;

    const result = courseCode
      ? await query(
          `select p.id, p.complete_name, p.academic_role
           from professor p
           join course_professor cp on cp.professor_id = p.id
           where cp.course_code = $1
           order by p.academic_role, p.complete_name`,
          [courseCode]
        )
      : await query(
          `select id, complete_name, academic_role
           from professor
           order by academic_role, complete_name`
        );

    res.json(result.rows);
  })
);

export default router;
