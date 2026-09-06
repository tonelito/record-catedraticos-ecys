import { Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';

function RequireAuth({ children }) {
  const { student, loading } = useSession();

  if (loading) return <p>Cargando...</p>;
  if (!student) return <Navigate to="/login" replace />;

  return children;
}

export default RequireAuth;
