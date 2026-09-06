import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta el token de sesión.' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.student = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}
