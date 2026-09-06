import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../lib/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await query(`
      select
        c.code,
        c.name,
        c.credits,
        c.area,
        c.is_mandatory,
        c.semester,
        coalesce(
          json_agg(cp.prerequisite_code) filter (where cp.prerequisite_code is not null),
          '[]'
        ) as prerequisites
      from course c
      left join course_prerequisite cp on cp.course_code = c.code
      group by c.code
      order by c.semester, c.code
    `);

    res.json(result.rows);
  })
);

export default router;
