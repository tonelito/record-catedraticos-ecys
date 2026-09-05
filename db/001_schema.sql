-- =============================================================================
--  Récord de Catedráticos — ECYS FIUSAC
--  Database schema (PostgreSQL)
--
--  This file is built incrementally, one table at a time.
--  Table order matters: a table cannot FOREIGN KEY-reference another table
--  that does not exist yet.
--
--  Naming convention: identifiers (tables, columns, types) are in English.
--  Stored *data* stays in Spanish — that includes every ENUM value below,
--  since those values travel as-is to the frontend, which is in Spanish.
-- =============================================================================


-- -----------------------------------------------------------------------------
--  ENUM: professor_role
--  A professor row can represent either a full professor ("catedrático") or
--  a teaching assistant ("auxiliar"). Same table, distinguished by this field.
-- -----------------------------------------------------------------------------
CREATE TYPE professor_role AS ENUM ('catedratico', 'auxiliar');


-- -----------------------------------------------------------------------------
--  Table: student
--  The application's users. They post, comment, vote, and manage their own
--  study network (which courses they've approved / are taking / still owe).
-- -----------------------------------------------------------------------------
CREATE TABLE student (
    id serial PRIMARY KEY,
    academic_registration text NOT NULL UNIQUE
    CHECK (academic_registration ~ '^\d{4}-\d{5}$'),
    dpi char(13) NOT NULL UNIQUE
    CHECK (dpi ~ '^\d{13}$'),

    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,

    password_hash text NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now()
);


-- -----------------------------------------------------------------------------
--  Table: professor
--  Professors and teaching assistants who can be the subject of a post.
--  Deliberately has no login of its own — professors don't use the app,
--  students just write about them.
-- -----------------------------------------------------------------------------
CREATE TABLE professor (
    id serial PRIMARY KEY,
    complete_name text NOT NULL,
    academic_role professor_role NOT NULL DEFAULT 'catedratico'
);


-- -----------------------------------------------------------------------------
--  ENUM: course_area
--  The three color-coded areas from the curriculum network image. A course
--  can also have no area at all (NULL) — see the `course` table below.
-- -----------------------------------------------------------------------------
CREATE TYPE course_area AS ENUM (
    'metodologia', 'desarrollo', 'ciencias'
);


-- -----------------------------------------------------------------------------
--  Table: course
--  One row per course in the curriculum (pensum). `code` is the course's own
--  natural key here — pensum codes are permanent and never reassigned, so
--  there's no need for a separate surrogate id like in `student`.
-- ------------------------------------------------------------------------------
CREATE TABLE course (
    code char(4) PRIMARY KEY,

    name text NOT NULL,
    credits smallint,
    area course_area,
    is_mandatory boolean NOT NULL DEFAULT false,

    semester smallint NOT NULL
    CHECK (semester BETWEEN 1 AND 10)
);


-- -----------------------------------------------------------------------------
--  Table: course_prerequisite
--  Self-referencing many-to-many: which courses must be approved before
--  taking `course_code`. Both columns point at `course(code)`, just with
--  opposite meaning.
-- -----------------------------------------------------------------------------
CREATE TABLE course_prerequisite (
    course_code char(4) NOT NULL REFERENCES course (code) ON DELETE CASCADE,
    prerequisite_code char(4) NOT NULL REFERENCES course (code) ON DELETE CASCADE,

    PRIMARY KEY (course_code, prerequisite_code),
    CHECK (course_code <> prerequisite_code)
);


-- -----------------------------------------------------------------------------
--  Table: course_professor
--  Many-to-many: which professors/assistants have taught which course.
--  This is what powers the professor dropdown in the "create post" screen
--  once a course is chosen.
-- -----------------------------------------------------------------------------
CREATE TABLE course_professor (
    course_code char(4) NOT NULL REFERENCES course (code) ON DELETE CASCADE,
    professor_id integer NOT NULL REFERENCES professor (id) ON DELETE CASCADE,

    PRIMARY KEY (course_code, professor_id)
);


-- -----------------------------------------------------------------------------
--  Table: post
--  A student's experience report about a course and/or a professor. Every
--  post must name a course; naming a professor is optional (a post can be
--  purely about the course itself).
-- -----------------------------------------------------------------------------
CREATE TABLE post (
    id serial PRIMARY KEY,
    student_id integer NOT NULL REFERENCES student (id) ON DELETE RESTRICT,
    course_code char(4) NOT NULL REFERENCES course (code) ON DELETE CASCADE,
    professor_id integer REFERENCES professor (id) ON DELETE SET NULL,

    title text NOT NULL,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX post_created_at_idx ON post (created_at DESC);
CREATE INDEX post_course_code_idx ON post (course_code);
CREATE INDEX post_professor_id_idx ON post (professor_id);


-- -----------------------------------------------------------------------------
--  Table: comment
--  Comments on a post. `parent_comment_id` is self-referencing and optional:
--  NULL means a top-level comment on the post; non-NULL means a reply to
--  another comment, which is what lets threads nest.
-- -----------------------------------------------------------------------------
CREATE TABLE comment (
    id serial PRIMARY KEY,
    post_id integer NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    student_id integer NOT NULL REFERENCES student (id) ON DELETE RESTRICT,
    parent_comment_id integer REFERENCES comment (id) ON DELETE CASCADE,

    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX comment_post_id_parent_id_idx ON comment (post_id, parent_comment_id);


-- -----------------------------------------------------------------------------
--  Table: post_vote
--  One vote per student per post, up (1) or down (-1). Casting the same
--  vote again should remove it (handled in the backend, not here) — this
--  table only allows one row per (student, post) pair.
-- -----------------------------------------------------------------------------
CREATE TABLE post_vote (
    student_id integer NOT NULL REFERENCES student (id) ON DELETE CASCADE,
    post_id integer NOT NULL REFERENCES post (id) ON DELETE CASCADE,

    value smallint NOT NULL
    CHECK (value IN (-1, 1)),

    PRIMARY KEY (student_id, post_id)
);


-- -----------------------------------------------------------------------------
--  Table: comment_vote
--  Same shape as post_vote, but for comments. Kept as a separate table
--  instead of a polymorphic "votable" table, since Postgres can't enforce
--  a real foreign key against more than one target table.
-- -----------------------------------------------------------------------------
CREATE TABLE comment_vote (
    student_id integer NOT NULL REFERENCES student (id) ON DELETE CASCADE,
    comment_id integer NOT NULL REFERENCES comment (id) ON DELETE CASCADE,

    value smallint NOT NULL
    CHECK (value IN (-1, 1)),

    PRIMARY KEY (student_id, comment_id)
);


-- -----------------------------------------------------------------------------
--  ENUM: course_status
--  A student's relationship to a course. A missing row in
--  student_course_status means 'pendiente' — see the table below.
-- -----------------------------------------------------------------------------
CREATE TYPE course_status AS ENUM ('aprobado', 'cursando', 'pendiente');


-- -----------------------------------------------------------------------------
--  Table: student_course_status
--  The student's own study network: which courses they've approved, are
--  currently taking, or explicitly marked as pending. A course with no row
--  here is implicitly 'pendiente' — setting it back to 'pendiente' should
--  delete the row instead of storing it, to keep this table's size tied to
--  actual progress rather than the full size of the pensum.
-- -----------------------------------------------------------------------------
CREATE TABLE student_course_status (
    student_id integer NOT NULL REFERENCES student (id) ON DELETE CASCADE,
    course_code char(4) NOT NULL REFERENCES course (code) ON DELETE CASCADE,

    status course_status NOT NULL,

    PRIMARY KEY (student_id, course_code)
);
