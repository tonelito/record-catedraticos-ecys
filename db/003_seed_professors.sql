-- =============================================================================
--  Récord de Catedráticos — ECYS FIUSAC
--  Seed: professors and teaching assistants, and who teaches what
--
--  Source: the real 2026 second-semester ECYS schedule published at
--  https://dtt-ecys.org/resources?r=10 — "profesor" becomes 'catedratico',
--  "practicante final" becomes 'auxiliar'.
--
--  Only people teaching a course that exists in the current pensum are
--  seeded. The schedule also lists old-pensum courses (Arquitectura 2,
--  Manejo e Implementación de Archivos, Modelación y Simulación 2, OLC 2,
--  Programación Comercial 1, Programación de Computadoras 1 090, Seminario
--  de Sistemas 1 and 2, Sistemas Operativos 2, Teoría de Sistemas 2); those
--  rows are dropped, along with the 36 people who appear only in them.
--
--  Names are stored as written in the schedule but reordered to "given names
--  first" and case-normalized. Accents are preserved exactly as the source
--  wrote them — none were invented, so a few names that should carry one
--  (Avila, Diaz, Ramirez) appear without it, matching the source.
--
--  Not idempotent: rerun only on a freshly created schema.
-- =============================================================================


-- -----------------------------------------------------------------------------
--  Professors (44) — schedule column "profesor"
-- -----------------------------------------------------------------------------
insert into professor (complete_name, academic_role) values
    ('Alberto Kanec Ixchop Ordoñez',                'catedratico'),
    ('Allan Alberto Morataya',                      'catedratico'),
    ('Alvaro Giovanni Longo Morales',               'catedratico'),
    ('Alvaro Obrayan Hernandez Garcia',             'catedratico'),
    ('Carlos Fernando Enrique López Garcia',        'catedratico'),
    ('Cesar Augusto Fernandez Caceres',             'catedratico'),
    ('Claudia Liceth Rojas Morales',                'catedratico'),
    ('Damaris Campos de López',                     'catedratico'),
    ('David Estuardo Morales',                      'catedratico'),
    ('Edgar Francisco Rodas Robledo',               'catedratico'),
    ('Edgar Rene Ornelis Hoil',                     'catedratico'),
    ('Eduardo Isaí Ajsivinac Xico',                 'catedratico'),
    ('Edwin Estuardo Zapeta Gómez',                 'catedratico'),
    ('Emiliano José Velásquez Najera',              'catedratico'),
    ('Evelyn Carolina Morales Ruiz',                'catedratico'),
    ('Everest Darwin Medinilla Rodriguez',          'catedratico'),
    ('Fernando José Paz González',                  'catedratico'),
    ('Floriza Felipa Avila Pesquera de Medinilla',  'catedratico'),
    ('Herman Igor Veliz Linares',                   'catedratico'),
    ('Ileana Guisela Ralda Recinos',                'catedratico'),
    ('Jorge Andrés Mejía Suchite',                  'catedratico'),
    ('Jorge Luis Alvarez Mejia',                    'catedratico'),
    ('Jose Manuel Ruiz Juarez',                     'catedratico'),
    ('Josue Daniel Chavez Portillo',                'catedratico'),
    ('Kevin Adiel Lajpop Ajpacajá',                 'catedratico'),
    ('Kevin Josue Santos Salazar',                  'catedratico'),
    ('Luis Alberto Arias',                          'catedratico'),
    ('Luis Alberto Vettorazzi Espana',              'catedratico'),
    ('Luis Fernando Espino Barrios',                'catedratico'),
    ('Manuel Haroldo Castillo Reyna',               'catedratico'),
    ('Marco Tulio Aldana Prillwitz',                'catedratico'),
    ('Mario Jose Bautista Fuentes',                 'catedratico'),
    ('Marlon Antonio Pérez Türk',                   'catedratico'),
    ('Marlon Francisco Orellana Lopez',             'catedratico'),
    ('Mirna Ivonne Aldana Larrazabal',              'catedratico'),
    ('Moises Eduardo Velasquez Oliva',              'catedratico'),
    ('Otto Amilcar Rodriguez Acosta',               'catedratico'),
    ('Otto Rene Escobar Leiva',                     'catedratico'),
    ('Pedro Pablo Hernandez Ramirez',               'catedratico'),
    ('Sergio Arnaldo Mendez Aguilar',               'catedratico'),
    ('Stanly Barrios',                              'catedratico'),
    ('Virginia Victoria Tala Ayerdi',               'catedratico'),
    ('William Estuardo Escobar Argueta',            'catedratico'),
    ('William Samuel Guevara Orellana',             'catedratico');


-- -----------------------------------------------------------------------------
--  Teaching assistants (61) — schedule column "practicante final"
--
--  Jorge Andrés Mejía Suchite appears in both columns of the schedule; he is
--  seeded once, as 'catedratico', since that is the higher role he holds.
-- -----------------------------------------------------------------------------
insert into professor (complete_name, academic_role) values
    ('Abdiel Fernando José Otzoy Otzín',            'auxiliar'),
    ('Adriana Lucia Ojeda Rivas',                   'auxiliar'),
    ('Adrián Josué Fernández Avila',                'auxiliar'),
    ('Alben Adrian Ramírez Gómez',                  'auxiliar'),
    ('Allan Josué Rafael Morales',                  'auxiliar'),
    ('Angel Samuel González Velásquez',             'auxiliar'),
    ('Byron Estuardo Solís González',               'auxiliar'),
    ('Carlos Alfredo Barrientos López',             'auxiliar'),
    ('Carlos José Blanco Guzmán',                   'auxiliar'),
    ('Carlos Manuel Lima y Lima',                   'auxiliar'),
    ('Carlos Samuel Aguilar Acosta',                'auxiliar'),
    ('César Fernando Sazo Quisquinay',              'auxiliar'),
    ('Daniel Eduardo Velásquez Avila',              'auxiliar'),
    ('Diego Abraham Robles Meza',                   'auxiliar'),
    ('Diego Fernando Debroy Salazar',               'auxiliar'),
    ('Diego Josue Guevara Abaj',                    'auxiliar'),
    ('Douglas Josue Martinez Huit',                 'auxiliar'),
    ('Dóminic Juan Pablo Ruano Pérez',              'auxiliar'),
    ('Eddy Alejandro Murga Barillas',               'auxiliar'),
    ('Eduardo Antonio Reyes Pineda',                'auxiliar'),
    ('Elian Angel Fernando Reyes Yac',              'auxiliar'),
    ('Elías Abraham Vasquez Soto',                  'auxiliar'),
    ('Enner Esaí Mendizabal Castro',                'auxiliar'),
    ('Erick Daniel Porón Muñoz',                    'auxiliar'),
    ('Estephanie Alejandra Ruiz Perez',             'auxiliar'),
    ('Fernando Jose Vicente Velasquez',             'auxiliar'),
    ('Fernando Misael Morales Ortíz',               'auxiliar'),
    ('Gerardo Leonel Ortiz Tobar',                  'auxiliar'),
    ('Giovanni Saul Concohá Cax',                   'auxiliar'),
    ('Gonzalo Fernando Pérez Cazún',                'auxiliar'),
    ('Henry David Quel Santos',                     'auxiliar'),
    ('Isaí Eliezer Magdiel Molina Guevara',         'auxiliar'),
    ('Javier Alejandro Matías Guarcas',             'auxiliar'),
    ('Jennifer Yulissa Taperio Manuel',             'auxiliar'),
    ('Jens Jeremy Pablo Sosof',                     'auxiliar'),
    ('Johnny Whillman Aldana Osorio',               'auxiliar'),
    ('Jorge Estuardo Pumay Soy',                    'auxiliar'),
    ('Joshua Alexander Vásquez del Aguila',         'auxiliar'),
    ('Josseline Griselda Montecinos Hernández',     'auxiliar'),
    ('Josue Daniel Solis Osorio',                   'auxiliar'),
    ('José Daniel Lorenzana Medina',                'auxiliar'),
    ('José Javier Bonilla Salazar',                 'auxiliar'),
    ('José Leonel López Ajvix',                     'auxiliar'),
    ('Juan Carlos Aragón Bámaca',                   'auxiliar'),
    ('Juan Pablo Samayoa Ruíz',                     'auxiliar'),
    ('Julio Alfredo Fernández Rodríguez',           'auxiliar'),
    ('Kervin Adolfo Cardona Ramírez',               'auxiliar'),
    ('Kevin Estuardo Sotoj García',                 'auxiliar'),
    ('Kevin Josué Hernández Gómez',                 'auxiliar'),
    ('Kevin Raúl Pozuelos Estrada',                 'auxiliar'),
    ('Luis Alberto Amezquita Vargas',               'auxiliar'),
    ('Luis Eduardo Monroy Pérez',                   'auxiliar'),
    ('Matthew Emmanuel Reyes Melgar',               'auxiliar'),
    ('Melvin Alexander Valencia Estrada',           'auxiliar'),
    ('Otto Roman Olivarez Cruz',                    'auxiliar'),
    ('Pablo Andres Rodriguez Lima',                 'auxiliar'),
    ('Roberto Miguel García Santizo',               'auxiliar'),
    ('Roni Eduardo Vásquez Flores',                 'auxiliar'),
    ('Sergio Saul Ralda Mejia',                     'auxiliar'),
    ('Sergio Sebastián Sandoval Ruiz',              'auxiliar'),
    ('William Alexander Santos Colindres',          'auxiliar');


-- -----------------------------------------------------------------------------
--  Who teaches what (116 rows)
--
--  Written as a VALUES list of (course code, person name) joined against the
--  professor table, so the serial ids assigned above never have to be
--  hardcoded here — and the id sequence is never touched, which is what
--  would happen if this file inserted explicit ids instead.
-- -----------------------------------------------------------------------------
insert into course_professor (course_code, professor_id)
select v.course_code, p.id
from (values
    -- 0014 Economía
    ('0014', 'Abdiel Fernando José Otzoy Otzín'),
    ('0014', 'Evelyn Carolina Morales Ruiz'),
    ('0014', 'Ileana Guisela Ralda Recinos'),
    ('0014', 'Kevin Estuardo Sotoj García'),
    -- 0089 Comunicación Asertiva
    ('0089', 'Carlos Fernando Enrique López Garcia'),
    ('0089', 'Kevin Josue Santos Salazar'),
    -- 0281 Sistemas Operativos 1
    ('0281', 'Elian Angel Fernando Reyes Yac'),
    ('0281', 'José Daniel Lorenzana Medina'),
    ('0281', 'Sergio Arnaldo Mendez Aguilar'),
    -- 0283 Análisis y Diseño de Sistemas 1
    ('0283', 'Byron Estuardo Solís González'),
    ('0283', 'Douglas Josue Martinez Huit'),
    ('0283', 'Edgar Francisco Rodas Robledo'),
    ('0283', 'William Samuel Guevara Orellana'),
    -- 0722 Teoría de Sistemas 1
    ('0722', 'Enner Esaí Mendizabal Castro'),
    ('0722', 'Jorge Luis Alvarez Mejia'),
    -- 0729 Modelación y Simulación 1
    ('0729', 'Alben Adrian Ramírez Gómez'),
    ('0729', 'Cesar Augusto Fernandez Caceres'),
    -- 0768 Introducción a los Algoritmos y Flujo de Datos
    ('0768', 'Emiliano José Velásquez Najera'),
    ('0768', 'Jorge Andrés Mejía Suchite'),
    ('0768', 'Josue Daniel Chavez Portillo'),
    -- 0770 Introducción a la Programación y Computación 1
    ('0770', 'Diego Abraham Robles Meza'),
    ('0770', 'Eduardo Isaí Ajsivinac Xico'),
    ('0770', 'Elías Abraham Vasquez Soto'),
    ('0770', 'Erick Daniel Porón Muñoz'),
    ('0770', 'Fernando Jose Vicente Velasquez'),
    ('0770', 'Herman Igor Veliz Linares'),
    ('0770', 'José Leonel López Ajvix'),
    ('0770', 'Marlon Francisco Orellana Lopez'),
    ('0770', 'Moises Eduardo Velasquez Oliva'),
    ('0770', 'William Estuardo Escobar Argueta'),
    -- 0771 Introducción a la Programación y Computación 2
    ('0771', 'Carlos Manuel Lima y Lima'),
    ('0771', 'Claudia Liceth Rojas Morales'),
    ('0771', 'Daniel Eduardo Velásquez Avila'),
    ('0771', 'Eddy Alejandro Murga Barillas'),
    ('0771', 'Edwin Estuardo Zapeta Gómez'),
    ('0771', 'Fernando José Paz González'),
    ('0771', 'Isaí Eliezer Magdiel Molina Guevara'),
    ('0771', 'Javier Alejandro Matías Guarcas'),
    ('0771', 'Jorge Andrés Mejía Suchite'),
    ('0771', 'Jose Manuel Ruiz Juarez'),
    ('0771', 'Marlon Antonio Pérez Türk'),
    ('0771', 'Stanly Barrios'),
    -- 0772 Estructuras de Datos
    ('0772', 'Alvaro Obrayan Hernandez Garcia'),
    ('0772', 'Edgar Rene Ornelis Hoil'),
    ('0772', 'Giovanni Saul Concohá Cax'),
    ('0772', 'Jens Jeremy Pablo Sosof'),
    ('0772', 'Luis Fernando Espino Barrios'),
    ('0772', 'Sergio Sebastián Sandoval Ruiz'),
    -- 0774 Sistemas de Bases de Datos 1
    ('0774', 'Allan Josué Rafael Morales'),
    ('0774', 'Alvaro Giovanni Longo Morales'),
    ('0774', 'Estephanie Alejandra Ruiz Perez'),
    ('0774', 'Julio Alfredo Fernández Rodríguez'),
    ('0774', 'Luis Fernando Espino Barrios'),
    ('0774', 'Matthew Emmanuel Reyes Melgar'),
    -- 0775 Sistemas de Bases de Datos 2
    ('0775', 'Joshua Alexander Vásquez del Aguila'),
    ('0775', 'Luis Alberto Arias'),
    ('0775', 'Otto Amilcar Rodriguez Acosta'),
    ('0775', 'Otto Roman Olivarez Cruz'),
    -- 0777 Organización de Lenguajes y Compiladores 1
    ('0777', 'Fernando Misael Morales Ortíz'),
    ('0777', 'Johnny Whillman Aldana Osorio'),
    ('0777', 'Kevin Adiel Lajpop Ajpacajá'),
    ('0777', 'Luis Eduardo Monroy Pérez'),
    ('0777', 'Manuel Haroldo Castillo Reyna'),
    ('0777', 'Mario Jose Bautista Fuentes'),
    -- 0778 Arquitectura de Computadores y Ensambladores 1
    ('0778', 'Carlos Alfredo Barrientos López'),
    ('0778', 'Diego Josue Guevara Abaj'),
    ('0778', 'Otto Rene Escobar Leiva'),
    -- 0780 Software Avanzado
    ('0780', 'Everest Darwin Medinilla Rodriguez'),
    ('0780', 'Juan Pablo Samayoa Ruíz'),
    ('0780', 'Kevin Raúl Pozuelos Estrada'),
    ('0780', 'Marco Tulio Aldana Prillwitz'),
    -- 0785 Análisis y Diseño de Sistemas 2
    ('0785', 'Abdiel Fernando José Otzoy Otzín'),
    ('0785', 'Claudia Liceth Rojas Morales'),
    ('0785', 'Juan Carlos Aragón Bámaca'),
    ('0785', 'Kevin Josué Hernández Gómez'),
    ('0785', 'Mirna Ivonne Aldana Larrazabal'),
    -- 0786 Sistemas Organizacionales y Gerenciales 1
    ('0786', 'Edwin Estuardo Zapeta Gómez'),
    ('0786', 'Josue Daniel Solis Osorio'),
    -- 0787 Sistemas Organizacionales y Gerenciales 2
    ('0787', 'Luis Alberto Amezquita Vargas'),
    ('0787', 'Luis Alberto Vettorazzi Espana'),
    ('0787', 'Mario Jose Bautista Fuentes'),
    ('0787', 'William Alexander Santos Colindres'),
    -- 0795 Lógica de Sistemas
    ('0795', 'Diego Fernando Debroy Salazar'),
    ('0795', 'Floriza Felipa Avila Pesquera de Medinilla'),
    ('0795', 'Jennifer Yulissa Taperio Manuel'),
    ('0795', 'Kervin Adolfo Cardona Ramírez'),
    ('0795', 'Virginia Victoria Tala Ayerdi'),
    -- 0796 Lenguajes Formales y de Programación
    ('0796', 'Adriana Lucia Ojeda Rivas'),
    ('0796', 'Carlos Samuel Aguilar Acosta'),
    ('0796', 'Damaris Campos de López'),
    ('0796', 'David Estuardo Morales'),
    ('0796', 'Jorge Estuardo Pumay Soy'),
    ('0796', 'Otto Amilcar Rodriguez Acosta'),
    -- 0964 Organización Computacional
    ('0964', 'Carlos José Blanco Guzmán'),
    ('0964', 'Eduardo Antonio Reyes Pineda'),
    ('0964', 'Fernando José Paz González'),
    ('0964', 'Gerardo Leonel Ortiz Tobar'),
    ('0964', 'Henry David Quel Santos'),
    ('0964', 'Melvin Alexander Valencia Estrada'),
    ('0964', 'Otto Rene Escobar Leiva'),
    ('0964', 'Sergio Saul Ralda Mejia'),
    -- 0970 Redes de Computadoras 1
    ('0970', 'Adrián Josué Fernández Avila'),
    ('0970', 'César Fernando Sazo Quisquinay'),
    ('0970', 'Josseline Griselda Montecinos Hernández'),
    ('0970', 'Luis Fernando Espino Barrios'),
    ('0970', 'Pablo Andres Rodriguez Lima'),
    ('0970', 'Pedro Pablo Hernandez Ramirez'),
    ('0970', 'Roni Eduardo Vásquez Flores'),
    -- 0972 Inteligencia Artificial 1
    ('0972', 'Alberto Kanec Ixchop Ordoñez'),
    ('0972', 'José Javier Bonilla Salazar'),
    ('0972', 'Luis Fernando Espino Barrios'),
    ('0972', 'Roberto Miguel García Santizo'),
    -- 0975 Redes de Computadoras 2
    ('0975', 'Allan Alberto Morataya'),
    ('0975', 'Angel Samuel González Velásquez'),
    ('0975', 'Dóminic Juan Pablo Ruano Pérez'),
    ('0975', 'Gonzalo Fernando Pérez Cazún')
) as v (course_code, professor_name)
join professor p on p.complete_name = v.professor_name;
