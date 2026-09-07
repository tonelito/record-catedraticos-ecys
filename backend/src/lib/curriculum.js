import { query } from '../db.js';

// La red de estudios de un estudiante: el pensum completo, con sus
// prerrequisitos y con el estado que ese estudiante le puso a cada curso.
//
// Vive aquí porque la usan dos rutas distintas con el mismo SQL y solo cambia
// de quién es el id: GET /profile/courses (la propia, editable) y
// GET /students/:academicRegistration/courses (la ajena, solo lectura).
export async function fetchCurriculum(studentId) {
  const result = await query(
    `
    select
      c.code,
      c.name,
      c.credits,
      c.area,
      c.is_mandatory,
      c.semester,
      coalesce(scs.status, 'pendiente') as status,
      coalesce(
        json_agg(cp.prerequisite_code) filter (where cp.prerequisite_code is not null),
        '[]'
      ) as prerequisites
    from course c
    left join student_course_status scs
      on scs.course_code = c.code and scs.student_id = $1
    left join course_prerequisite cp on cp.course_code = c.code
    -- scs.status va en el group by porque viene de otra tabla: Postgres no
    -- deduce solo que hay a lo sumo una fila de estado por curso.
    group by c.code, scs.status
    order by c.semester, c.code
    `,
    [studentId]
  );

  return result.rows;
}
