import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { House, LogOut, Search, User } from 'lucide-react';
import { useSession } from '../context/SessionContext.jsx';
import './AppNavbar.css';

function AppNavbar() {
  const { logout } = useSession();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(event) {
    event.preventDefault();

    const academicRegistration = query.trim();
    if (!academicRegistration) return;

    navigate(`/students/${academicRegistration}`);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/assets/logo-ecys-fiusac.png" alt="ECYS — Escuela de Ciencias y Sistemas" />
      </Link>

      <div className="navbar-rule" />

      <Link to="/" className="navbar-home" title="Inicio">
        <House size={19} strokeWidth={1.9} />
        <span>Inicio</span>
      </Link>

      <form className="navbar-search" onSubmit={handleSearch}>
        <div className="navbar-search-field">
          <Search size={15} strokeWidth={2.1} />
          <input
            type="text"
            placeholder="Buscar estudiante por registro académico…"
            aria-label="Buscar estudiante por registro académico"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button type="submit">Buscar</button>
      </form>

      <div className="navbar-actions">
        <Link to="/profile" className="navbar-profile">
          <span className="navbar-avatar">
            <User size={17} strokeWidth={1.9} />
          </span>
          <span className="navbar-action-label">Mi perfil</span>
        </Link>

        <button type="button" className="navbar-logout" onClick={handleLogout}>
          <LogOut size={15} strokeWidth={2} />
          <span className="navbar-action-label">Salir</span>
        </button>
      </div>
    </header>
  );
}

export default AppNavbar;
