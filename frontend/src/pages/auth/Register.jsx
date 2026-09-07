import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "../../context/SessionContext.jsx";
import "../../styles/auth.css";
import "./Register.css";

function Register() {
  const { register } = useSession();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    academicRegistration: "",
    dpi: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(name, value) {
    setFields((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const dpi = fields.dpi.replace(/\s/g, "");

    if (dpi.length !== 13) {
      setError("El DPI debe tener 13 dígitos.");
      return;
    }

    if (fields.password !== fields.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        academicRegistration: fields.academicRegistration,
        dpi,
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        password: fields.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="register-brand">
          <img
            src="/assets/logo-ecys-fiusac.png"
            alt="ECYS"
            className="register-logo"
          />
          <div className="register-brand-rule" />
          <div className="register-brand-text">
            <span className="auth-university">
              USAC · Facultad de Ingeniería
            </span>
            <span className="auth-faculty">Escuela de Ciencias y Sistemas</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Creá tu cuenta</h1>
          <p>
            Tus publicaciones y comentarios quedan identificados con tu registro
            académico.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-grid">
            <div className="auth-field">
              <label htmlFor="academicRegistration">Registro académico</label>
              <input
                id="academicRegistration"
                type="text"
                placeholder="2025-11045"
                pattern="\d{4}-\d{5}"
                title="Formato: 0000-00000"
                value={fields.academicRegistration}
                onChange={(event) =>
                  updateField("academicRegistration", event.target.value)
                }
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="dpi">DPI</label>
              <input
                id="dpi"
                type="text"
                placeholder="0000 00000 0000"
                value={fields.dpi}
                onChange={(event) => updateField("dpi", event.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="firstName">Nombres</label>
              <input
                id="firstName"
                type="text"
                placeholder="Juan Luis"
                value={fields.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">Apellidos</label>
              <input
                id="lastName"
                type="text"
                placeholder="Galicia Mazariegos"
                value={fields.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                required
              />
            </div>

            <div className="auth-field register-field--full">
              <label htmlFor="email">Correo estudiantil</label>
              <input
                id="email"
                type="email"
                placeholder="dpi@ingenieria.usac.edu.gt"
                value={fields.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={fields.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={fields.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                required
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="register-actions">
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Registrando..." : "Registrar usuario"}
            </button>
            <p className="auth-footer">
              ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
