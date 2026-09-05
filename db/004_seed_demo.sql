-- =============================================================================
--  Récord de Catedráticos — ECYS FIUSAC
--  Seed: demo content (6 students, 3 posts, 3 comments, votes, study network)
--
--  Purpose: make the app look like the approved design the moment it boots,
--  instead of showing an empty feed. Titles, post bodies and comment text are
--  copied verbatim from the design mockup (design/Mockups.dc.html).
--
--  These six students are fictional characters from that mockup. Their DPIs
--  and e-mail addresses do not exist — they were invented to satisfy the
--  NOT NULL / UNIQUE / CHECK constraints, following the institutional
--  <dpi>@ingenieria.usac.edu.gt pattern so the screens look realistic.
--
--  password_hash holds a placeholder, not a bcrypt hash: nobody can log in as
--  a demo student. Real hashes get generated once the backend exists and has
--  bcrypt installed.
--
--  Two departures from the mockup, both agreed on beforehand:
--   * The mockup's professors ("Ing. Otto Rodríguez", "Ing. Neftaly Cordón")
--     are invented and are not in the professor table, which was seeded from
--     the real 2026 schedule. The real professors of those courses are used.
--   * The mockup's scores (128, 41, 7) are static design text. A real score is
--     the sum of one vote per student, so with six students the honest
--     equivalent is 3, 2 and 1 — same ordering, real data.
--
--  Not idempotent: rerun only on a freshly created schema.
-- =============================================================================


-- -----------------------------------------------------------------------------
--  Students
-- -----------------------------------------------------------------------------
insert into student (academic_registration, dpi, first_name, last_name, email, password_hash) values
    ('2025-11045', '2985471630101', 'Juan Luis',      'Galicia Mazariegos', '2985471630101@ingenieria.usac.edu.gt', 'PLACEHOLDER_NOT_A_REAL_HASH'),
    ('2024-08877', '3012558940101', 'María Fernanda', 'Ríos',               '3012558940101@ingenieria.usac.edu.gt', 'PLACEHOLDER_NOT_A_REAL_HASH'),
    ('2023-04412', '2874136590101', 'Diego',          'Estrada',            '2874136590101@ingenieria.usac.edu.gt', 'PLACEHOLDER_NOT_A_REAL_HASH'),
    ('2024-01199', '3145729860101', 'Andrea',         'López',              '3145729860101@ingenieria.usac.edu.gt', 'PLACEHOLDER_NOT_A_REAL_HASH'),
    ('2023-07734', '2769384510101', 'Carlos',         'Menéndez',           '2769384510101@ingenieria.usac.edu.gt', 'PLACEHOLDER_NOT_A_REAL_HASH'),
    ('2025-02210', '3098216470101', 'Sofía',          'Ramírez',            '3098216470101@ingenieria.usac.edu.gt', 'PLACEHOLDER_NOT_A_REAL_HASH');


-- -----------------------------------------------------------------------------
--  Posts
--
--  Same VALUES-join trick as 003: serial ids are never hardcoded, they are
--  looked up from the rows that were just inserted.
--
--  Note the LEFT JOIN on professor: the third post deliberately has no
--  professor (it is about the course itself). A plain JOIN would find no
--  match for its NULL name and would silently drop that row entirely.
-- -----------------------------------------------------------------------------
insert into post (student_id, course_code, professor_id, title, content, created_at)
select s.id, v.course_code, p.id, v.title, v.content, v.created_at
from (values
    ('2025-11045', '0964', 'Otto Rene Escobar Leiva',
     '¿Cómo lleva el laboratorio el Ing. Otto este semestre?',
     'Llevé el curso el semestre pasado. Las clases magistrales son ordenadas y sube el material antes de cada sesión, pero el laboratorio pesa bastante en la nota final: son cuatro prácticas y un proyecto en ensamblador.',
     timestamptz '2026-09-18 09:24:00-06'),

    ('2024-08877', '0770', 'Marlon Francisco Orellana Lopez',
     'Carga real de proyectos en IPC1 este semestre',
     'Son tres proyectos y dos exámenes cortos por parcial. El primer proyecto sale la segunda semana, así que no lo dejen para el final.',
     timestamptz '2026-09-17 15:40:00-06'),

    ('2023-04412', '0707', null,
     '¿Vale la pena adelantar Gestión de Proyectos?',
     'Aquí el catedrático es opcional: la publicación es sobre el curso en general, no sobre quién lo imparte.',
     timestamptz '2026-09-16 11:05:00-06')
) as v (academic_registration, course_code, professor_name, title, content, created_at)
join student s on s.academic_registration = v.academic_registration
left join professor p on p.complete_name = v.professor_name;


-- -----------------------------------------------------------------------------
--  Comments
--
--  A nested thread on the first post: Andrea replies to the post, Carlos
--  replies to Andrea, Sofía replies to Carlos. They are inserted one at a
--  time and in order, because each one needs the id of the previous one as
--  its parent_comment_id.
-- -----------------------------------------------------------------------------
insert into comment (post_id, student_id, parent_comment_id, content, created_at) values (
    (select id from post where title = '¿Cómo lleva el laboratorio el Ing. Otto este semestre?'),
    (select id from student where academic_registration = '2024-01199'),
    null,
    'Confirmo lo del proyecto en ensamblador. Lo importante es entregar la práctica 3 a tiempo porque de ahí depende el resto.',
    timestamptz '2026-09-18 11:02:00-06'
);

insert into comment (post_id, student_id, parent_comment_id, content, created_at) values (
    (select id from post where title = '¿Cómo lleva el laboratorio el Ing. Otto este semestre?'),
    (select id from student where academic_registration = '2023-07734'),
    (select id from comment where student_id = (select id from student where academic_registration = '2024-01199')),
    'La práctica 3 es la más pesada, sí. Yo la hice en pareja y aún así nos tomó dos semanas.',
    timestamptz '2026-09-18 16:18:00-06'
);

insert into comment (post_id, student_id, parent_comment_id, content, created_at) values (
    (select id from post where title = '¿Cómo lleva el laboratorio el Ing. Otto este semestre?'),
    (select id from student where academic_registration = '2025-02210'),
    (select id from comment where student_id = (select id from student where academic_registration = '2023-07734')),
    'Este semestre la dejaron individual, ojo con eso.',
    timestamptz '2026-09-19 08:47:00-06'
);


-- -----------------------------------------------------------------------------
--  Post votes — resulting scores: 3, 2, 1
--
--  One row per (student, post). The single -1 is there on purpose, so the
--  downvote path is exercised by the seed and not only by hand-clicking.
-- -----------------------------------------------------------------------------
insert into post_vote (student_id, post_id, value)
select s.id, p.id, v.value
from (values
    ('2024-08877', '¿Cómo lleva el laboratorio el Ing. Otto este semestre?',  1),
    ('2024-01199', '¿Cómo lleva el laboratorio el Ing. Otto este semestre?',  1),
    ('2023-07734', '¿Cómo lleva el laboratorio el Ing. Otto este semestre?',  1),
    ('2025-02210', '¿Cómo lleva el laboratorio el Ing. Otto este semestre?',  1),
    ('2023-04412', '¿Cómo lleva el laboratorio el Ing. Otto este semestre?', -1),

    ('2025-11045', 'Carga real de proyectos en IPC1 este semestre',            1),
    ('2024-01199', 'Carga real de proyectos en IPC1 este semestre',            1),

    ('2025-11045', '¿Vale la pena adelantar Gestión de Proyectos?',            1)
) as v (academic_registration, post_title, value)
join student s on s.academic_registration = v.academic_registration
join post p on p.title = v.post_title;


-- -----------------------------------------------------------------------------
--  Comment votes — resulting scores: 3, 2, 1
--
--  Each demo student wrote exactly one comment, so a comment can be addressed
--  by its author's registration number. Juan Luis upvoting Andrea's comment
--  is what makes the mockup's "already voted" orange arrow show up.
-- -----------------------------------------------------------------------------
insert into comment_vote (student_id, comment_id, value)
select voter.id, c.id, v.value
from (values
    ('2025-11045', '2024-01199', 1),
    ('2023-07734', '2024-01199', 1),
    ('2025-02210', '2024-01199', 1),

    ('2025-11045', '2023-07734', 1),
    ('2024-01199', '2023-07734', 1),

    ('2024-01199', '2025-02210', 1)
) as v (voter_registration, author_registration, value)
join student voter  on voter.academic_registration  = v.voter_registration
join student author on author.academic_registration = v.author_registration
join comment c      on c.student_id = author.id;


-- -----------------------------------------------------------------------------
--  Study network (61 rows)
--
--  Taken from the mockup's own initial state:
--   * Juan Luis Galicia  — semesters 1-3 approved, plus 0112/0114/0152/0771;
--     the rest of semester 4 in progress.  Approved credits: 110.
--   * María Fernanda Ríos — semesters 1-4 approved, semester 5 in progress
--     except 0018 and 0778.  Approved credits: 118.
--
--  Courses with no row here are implicitly 'pendiente', which is why
--  semesters 5-10 are absent for Juan Luis. Note that 2025 Prácticas
--  Iniciales counts as approved for María but adds no credits: its credits
--  column is NULL, and SUM() skips NULLs.
-- -----------------------------------------------------------------------------
insert into student_course_status (student_id, course_code, status)
select s.id, v.course_code, v.status
from (values
    -- Juan Luis Galicia (2025-11045)
    ('2025-11045', '0005', course_status 'aprobado'),
    ('2025-11045', '0017', 'aprobado'),
    ('2025-11045', '0101', 'aprobado'),
    ('2025-11045', '0006', 'aprobado'),
    ('2025-11045', '0039', 'aprobado'),
    ('2025-11045', '0019', 'aprobado'),
    ('2025-11045', '0103', 'aprobado'),
    ('2025-11045', '0147', 'aprobado'),
    ('2025-11045', '0768', 'aprobado'),
    ('2025-11045', '0960', 'aprobado'),
    ('2025-11045', '0008', 'aprobado'),
    ('2025-11045', '0040', 'aprobado'),
    ('2025-11045', '0089', 'aprobado'),
    ('2025-11045', '0107', 'aprobado'),
    ('2025-11045', '0150', 'aprobado'),
    ('2025-11045', '0770', 'aprobado'),
    ('2025-11045', '0795', 'aprobado'),
    ('2025-11045', '0962', 'aprobado'),
    ('2025-11045', '0001', 'aprobado'),
    ('2025-11045', '0009', 'aprobado'),
    ('2025-11045', '0112', 'aprobado'),
    ('2025-11045', '0114', 'aprobado'),
    ('2025-11045', '0152', 'aprobado'),
    ('2025-11045', '0771', 'aprobado'),
    ('2025-11045', '0964', 'cursando'),
    ('2025-11045', '2025', 'cursando'),
    ('2025-11045', '0010', 'cursando'),
    ('2025-11045', '0011', 'cursando'),
    -- María Fernanda Ríos (2024-08877)
    ('2024-08877', '0005', 'aprobado'),
    ('2024-08877', '0017', 'aprobado'),
    ('2024-08877', '0101', 'aprobado'),
    ('2024-08877', '0006', 'aprobado'),
    ('2024-08877', '0039', 'aprobado'),
    ('2024-08877', '0019', 'aprobado'),
    ('2024-08877', '0103', 'aprobado'),
    ('2024-08877', '0147', 'aprobado'),
    ('2024-08877', '0768', 'aprobado'),
    ('2024-08877', '0960', 'aprobado'),
    ('2024-08877', '0008', 'aprobado'),
    ('2024-08877', '0040', 'aprobado'),
    ('2024-08877', '0089', 'aprobado'),
    ('2024-08877', '0107', 'aprobado'),
    ('2024-08877', '0150', 'aprobado'),
    ('2024-08877', '0770', 'aprobado'),
    ('2024-08877', '0795', 'aprobado'),
    ('2024-08877', '0962', 'aprobado'),
    ('2024-08877', '0001', 'aprobado'),
    ('2024-08877', '0009', 'aprobado'),
    ('2024-08877', '0112', 'aprobado'),
    ('2024-08877', '0114', 'aprobado'),
    ('2024-08877', '0152', 'aprobado'),
    ('2024-08877', '0771', 'aprobado'),
    ('2024-08877', '0964', 'aprobado'),
    ('2024-08877', '2025', 'aprobado'),
    ('2024-08877', '0010', 'aprobado'),
    ('2024-08877', '0011', 'aprobado'),
    ('2024-08877', '0116', 'cursando'),
    ('2024-08877', '0118', 'cursando'),
    ('2024-08877', '0281', 'cursando'),
    ('2024-08877', '0732', 'cursando'),
    ('2024-08877', '0772', 'cursando')
) as v (academic_registration, course_code, status)
join student s on s.academic_registration = v.academic_registration;
