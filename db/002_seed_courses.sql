-- =============================================================================
--  Récord de Catedráticos — ECYS FIUSAC
--  Seed: courses and their prerequisites (75 courses, 123 prerequisite rows)
--
--  Source of truth: the official ECYS curriculum network images (red de
--  estudios), transcribed course by course. The PENSUM array in the design
--  mockup was used as a starting point but had truncated prerequisite lists
--  on 10 courses, was missing course 7999 entirely, and had is_mandatory
--  populated on only 3 of 75 courses — all corrected here against the images.
--
--  Course names stay in Spanish: they are *data*, not code identifiers.
--  Accents and the TIC acronym are normalized to their correct written form
--  (the source images render some of them without accents / in lowercase).
--
--  This file is not idempotent: running it twice fails on the primary key.
--  To reseed, drop and recreate the schema with 001_schema.sql first.
-- =============================================================================


-- -----------------------------------------------------------------------------
--  Courses
--
--  credits is NULL for the three "Prácticas" courses — they grant no credits
--  in the pensum, which is different from granting zero.
--  area is NULL for courses with no color strip in the curriculum image.
--  is_mandatory is the black dot in the image; 55 of the 75 courses carry it.
-- -----------------------------------------------------------------------------
insert into course (code, name, credits, area, is_mandatory, semester) values
    -- Primer semestre
    ('0005', 'Técnicas de Estudio e Investigación',              3,    null,          true,  1),
    ('0017', 'Área Social Humanística 1',                        3,    null,          true,  1),
    ('0101', 'Área Matemática Básica 1',                         9,    null,          true,  1),
    ('0006', 'Idioma Técnico 1',                                 3,    null,          false, 1),
    ('0039', 'Deportes 1',                                       2,    null,          false, 1),

    -- Segundo semestre
    ('0019', 'Área Social Humanística 2',                        3,    null,          true,  2),
    ('0103', 'Área Matemática Básica 2',                         9,    null,          true,  2),
    ('0147', 'Física Básica',                                    5,    null,          true,  2),
    ('0768', 'Introducción a los Algoritmos y Flujo de Datos',   4,    'desarrollo',  true,  2),
    ('0960', 'Matemática para Computación 1',                    5,    null,          true,  2),
    ('0008', 'Idioma Técnico 2',                                 3,    null,          false, 2),
    ('0040', 'Deportes 2',                                       2,    null,          false, 2),

    -- Tercer semestre
    ('0089', 'Comunicación Asertiva',                            2,    'metodologia', true,  3),
    ('0107', 'Área Matemática Intermedia 1',                     9,    null,          true,  3),
    ('0150', 'Física 1',                                         5,    null,          true,  3),
    ('0770', 'Introducción a la Programación y Computación 1',   6,    'desarrollo',  true,  3),
    ('0795', 'Lógica de Sistemas',                               3,    'metodologia', true,  3),
    ('0962', 'Matemática para Computación 2',                    5,    null,          true,  3),
    ('0001', 'Ética Profesional',                                2,    null,          false, 3),
    ('0009', 'Idioma Técnico 3',                                 3,    null,          false, 3),

    -- Cuarto semestre
    ('0112', 'Área Matemática Intermedia 2',                     6,    null,          true,  4),
    ('0114', 'Área Matemática Intermedia 3',                     6,    null,          true,  4),
    ('0152', 'Física 2',                                         6,    null,          true,  4),
    ('0771', 'Introducción a la Programación y Computación 2',   6,    'desarrollo',  true,  4),
    ('0964', 'Organización Computacional',                       4,    'ciencias',    true,  4),
    ('2025', 'Prácticas Iniciales',                              null, null,          false, 4),
    ('0010', 'Lógica',                                           1,    null,          false, 4),
    ('0011', 'Idioma Técnico 4',                                 3,    null,          false, 4),

    -- Quinto semestre
    ('0116', 'Matemática Aplicada 3',                            5,    null,          true,  5),
    ('0118', 'Matemática Aplicada 1',                            5,    null,          true,  5),
    ('0281', 'Sistemas Operativos 1',                            6,    'ciencias',    true,  5),
    ('0732', 'Estadística 1',                                    5,    null,          true,  5),
    ('0772', 'Estructuras de Datos',                             6,    'desarrollo',  true,  5),
    ('0778', 'Arquitectura de Computadores y Ensambladores 1',   5,    'ciencias',    true,  5),
    ('0018', 'Filosofía de la Ciencia',                          1,    null,          false, 5),

    -- Sexto semestre
    ('0014', 'Economía',                                         3,    'metodologia', true,  6),
    ('0601', 'Investigación de Operaciones I',                   6,    null,          true,  6),
    ('0722', 'Teoría de Sistemas 1',                             4,    'metodologia', true,  6),
    ('0767', 'Nuevas Infraestructuras para TIC',                 5,    'ciencias',    true,  6),
    ('0774', 'Sistemas de Bases de Datos 1',                     6,    'desarrollo',  true,  6),
    ('0796', 'Lenguajes Formales y de Programación',             4,    'ciencias',    true,  6),
    ('0120', 'Matemática Aplicada 2',                            5,    null,          false, 6),
    ('0122', 'Matemática Aplicada 4',                            5,    null,          false, 6),
    ('0200', 'Ingeniería Eléctrica 1',                           6,    null,          false, 6),

    -- Séptimo semestre
    ('0603', 'Investigación de Operaciones II',                  6,    null,          true,  7),
    ('0707', 'Gestión de Proyectos de TIC',                      4,    'metodologia', true,  7),
    ('0775', 'Sistemas de Bases de Datos 2',                     7,    'desarrollo',  true,  7),
    ('0777', 'Organización de Lenguajes y Compiladores 1',       6,    'ciencias',    true,  7),
    ('0794', 'Seminario de Computación',                         4,    'ciencias',    true,  7),
    ('2036', 'Prácticas Intermedias',                            null, null,          false, 7),
    ('0734', 'Estadística 2',                                    5,    null,          false, 7),

    -- Octavo semestre
    ('0283', 'Análisis y Diseño de Sistemas 1',                  6,    'desarrollo',  true,  8),
    ('0649', 'Contabilidad Financiera para Informáticos',        3,    'metodologia', true,  8),
    ('0719', 'Nuevas Tecnologías para Desarrollo de Software',   4,    'desarrollo',  true,  8),
    ('0786', 'Sistemas Organizacionales y Gerenciales 1',        5,    'metodologia', true,  8),
    ('0970', 'Redes de Computadoras 1',                          5,    'ciencias',    true,  8),
    ('0972', 'Inteligencia Artificial 1',                        5,    'ciencias',    true,  8),
    ('0700', 'Ingeniería Económica 1',                           4,    null,          false, 8),
    ('0776', 'Bases de Datos Avanzadas',                         5,    'desarrollo',  false, 8),

    -- Noveno semestre
    ('0729', 'Modelación y Simulación 1',                        6,    'metodologia', true,  9),
    ('0785', 'Análisis y Diseño de Sistemas 2',                  6,    'desarrollo',  true,  9),
    ('0787', 'Sistemas Organizacionales y Gerenciales 2',        5,    'metodologia', true,  9),
    ('0793', 'Seminario de Software',                            4,    'desarrollo',  true,  9),
    ('0968', 'Inteligencia Artificial 2',                        5,    'ciencias',    true,  9),
    ('0975', 'Redes de Computadoras 2',                          5,    'ciencias',    true,  9),
    ('2009', 'Prácticas Finales Ingeniería Ciencias y Sistemas', null, null,          false, 9),

    -- Décimo semestre
    --  0799 and 7999 are alternatives to each other (the crossed-arrows mark
    --  in the image, not the mandatory dot). The alternation itself is not
    --  modeled — out of scope for this MVP.
    ('0469', 'Ciencia de Datos',                                 4,    'desarrollo',  true,  10),
    ('0613', 'Prospectiva Tecnológica',                          5,    'metodologia', true,  10),
    ('0780', 'Software Avanzado',                                6,    'desarrollo',  true,  10),
    ('0790', 'Emprendedores de Negocios Informáticos',           6,    'metodologia', true,  10),
    ('0799', 'Seminario de Investigación',                       3,    'metodologia', false, 10),
    ('0967', 'Seguridad Informática',                            4,    'ciencias',    true,  10),
    ('0735', 'Auditoría de Proyectos de Software',               6,    'metodologia', true,  10),
    ('0974', 'Redes de Nueva Generación',                        3,    'metodologia', true,  10),
    ('7999', 'Seminario de Investigación E.P.S. Sistemas',       3,    'metodologia', false, 10);


-- -----------------------------------------------------------------------------
--  Prerequisites
--
--  Read each row as: to take <course_code>, you must have approved
--  <prerequisite_code>. First-semester courses have none, so they are absent.
-- -----------------------------------------------------------------------------
insert into course_prerequisite (course_code, prerequisite_code) values
    -- Segundo semestre
    ('0019', '0017'),
    ('0103', '0101'),
    ('0147', '0101'),
    ('0768', '0101'),
    ('0960', '0101'),
    ('0008', '0006'),
    ('0040', '0039'),

    -- Tercer semestre
    ('0089', '0103'), ('0089', '0147'), ('0089', '0960'),
    ('0107', '0103'),
    ('0150', '0103'), ('0150', '0147'),
    ('0770', '0768'), ('0770', '0103'), ('0770', '0147'), ('0770', '0960'),
    ('0795', '0103'), ('0795', '0147'), ('0795', '0960'),
    ('0962', '0103'), ('0962', '0147'), ('0962', '0960'),
    ('0001', '0019'),
    ('0009', '0008'),

    -- Cuarto semestre
    ('0112', '0107'),
    ('0114', '0107'),
    ('0152', '0107'), ('0152', '0150'),
    ('0771', '0107'), ('0771', '0770'), ('0771', '0795'), ('0771', '0962'),
    ('0964', '0089'), ('0964', '0150'), ('0964', '0770'), ('0964', '0962'),
    ('2025', '0089'), ('2025', '0107'), ('2025', '0770'),
    ('0010', '0019'),
    ('0011', '0009'),

    -- Quinto semestre
    ('0116', '0112'), ('0116', '0114'),
    ('0118', '0112'), ('0118', '0114'),
    ('0281', '0964'),
    ('0732', '0107'), ('0732', '0005'),
    ('0772', '0089'), ('0772', '0771'),
    ('0778', '0964'),
    ('0018', '0019'),

    -- Sexto semestre
    ('0014', '0732'),
    ('0601', '0732'), ('0601', '0771'),
    ('0722', '0116'), ('0722', '0118'), ('0722', '0732'), ('0722', '0772'),
    ('0767', '0281'), ('0767', '0778'),
    ('0774', '0772'),
    ('0796', '0772'), ('0796', '0778'),
    ('0120', '0118'),
    ('0122', '0118'),
    ('0200', '0114'), ('0200', '0152'),

    -- Séptimo semestre
    ('0603', '0601'),
    ('0707', '0601'), ('0707', '0722'),
    ('0775', '0281'), ('0775', '0774'),
    ('0777', '0281'), ('0777', '0796'),
    ('0794', '0767'), ('0794', '0796'),
    ('2036', '0767'), ('2036', '0722'), ('2036', '0774'), ('2036', '0796'), ('2036', '2025'),
    ('0734', '0732'),

    -- Octavo semestre
    ('0283', '0775'),
    ('0649', '0707'), ('0649', '0603'),
    ('0719', '0775'),
    ('0786', '0707'), ('0786', '0603'),
    ('0970', '0794'),
    ('0972', '0772'), ('0972', '0777'),
    ('0700', '0732'),
    ('0776', '0775'),

    -- Noveno semestre
    ('0729', '0603'), ('0729', '0722'),
    ('0785', '0283'),
    ('0787', '0649'), ('0787', '0786'),
    ('0793', '0719'), ('0793', '0283'),
    ('0968', '0972'),
    ('0975', '0970'),
    ('2009', '0283'), ('2009', '0719'), ('2009', '0786'), ('2009', '0972'), ('2009', '2036'),

    -- Décimo semestre
    ('0469', '0968'),
    ('0613', '0729'), ('0613', '0968'),
    ('0780', '0785'),
    ('0790', '0787'),
    ('0799', '0785'), ('0799', '0786'), ('0799', '0793'),
    ('0967', '0975'),
    ('0735', '0785'),
    ('0974', '0975'),
    ('7999', '0785'), ('7999', '0786'), ('7999', '0793');
