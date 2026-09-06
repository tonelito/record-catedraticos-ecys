import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import '../styles/auth.css';
import './Login.css';

function Login() {
  const { login } = useSession();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(identifier, password, remember);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/assets/logo-ecys-fiusac.png" alt="ECYS" className="auth-logo" />
          <div className="auth-brand-text">
            <span className="auth-university">Universidad de San Carlos de Guatemala</span>
            <span className="auth-faculty">Facultad de Ingeniería · Escuela de Ciencias y Sistemas</span>
          </div>
        </div>

        <div className="auth-divider" />

        <div className="auth-heading">
          <h1>Iniciar sesión</h1>
          <p>Ingresá con tu registro académico para ver el récord de catedráticos.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="identifier">Registro académico / DPI</label>
            <input
              id="identifier"
              type="text"
              placeholder="2025-11045"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Recordarme en este equipo</span>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <span className="auth-link-muted" title="Próximamente disponible">
            ¿Olvidó su contraseña?
          </span>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
