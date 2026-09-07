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

// CORS_ORIGIN acepta varios orígenes separados por coma, porque en la práctica
// hacen falta al menos tres: el Vite local, la URL de producción de Vercel y
// las URLs únicas que Vercel le da a cada despliegue (*.vercel.app).
const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  // Sin cabecera Origin no es una petición de navegador (curl, Postman, el
  // propio Render revisando /health): no hay nada que bloquear.
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Cualquier despliegue del proyecto en Vercel, incluidas las previews.
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
  })
);
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
