import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import professorsRouter from './routes/professors.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import votesRouter from './routes/votes.js';
import profileRouter from './routes/profile.js';
import studentsRouter from './routes/students.js';

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/professors', professorsRouter);
app.use('/posts', postsRouter);
app.use('/posts', commentsRouter);
app.use('/votes', votesRouter);
app.use('/profile', profileRouter);
app.use('/students', studentsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});
