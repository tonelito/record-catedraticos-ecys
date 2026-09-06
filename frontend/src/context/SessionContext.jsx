import { createContext, useContext, useEffect, useState } from 'react';
import { api, clearToken, getToken, setToken } from '../api/client.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [student, setStudent] = useState(null);
  // Solo hay algo que cargar si ya había un token guardado de una sesión previa.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    api
      .get('/profile')
      .then(setStudent)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(identifier, password, remember = true) {
    const data = await api.post('/auth/login', { identifier, password });
    setToken(data.token, remember);
    setStudent(data.student);
  }

  async function register(fields) {
    const data = await api.post('/auth/register', fields);
    setToken(data.token);
    setStudent(data.student);
  }

  function logout() {
    clearToken();
    setStudent(null);
  }

  const value = { student, loading, login, register, logout };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de un SessionProvider.');
  }
  return context;
}
