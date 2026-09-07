import { useEffect, useState } from "react";
import { User } from "lucide-react";
import AppNavbar from "../../components/layout/AppNavbar.jsx";
import CurriculumGrid from "../../components/curriculum/CurriculumGrid.jsx";
import CurriculumLegend from "../../components/curriculum/CurriculumLegend.jsx";
import EditProfileModal from "./EditProfileModal.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { api } from "../../api/client.js";
import "../../styles/profile.css";
import "./MyProfile.css";

function MyProfile() {
  const { student, updateStudent } = useSession();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // null = modal cerrado; "email" | "password" = pestaña con la que abre.
  const [editingTab, setEditingTab] = useState(null);

  useEffect(() => {
    let ignore = false;

    api
      .get("/profile/courses")
      .then((data) => {
        if (!ignore) setCourses(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Guardar el estado y reflejarlo en el array. No hay actualización optimista:
  // si el PUT falla, CurriculumGrid muestra el error y el array queda intacto.
  async function handleStatusChange(code, status) {
    await api.put(`/profile/courses/${code}`, { status });
    setCourses((previous) =>
      previous.map((course) => (course.code === code ? { ...course, status } : course)),
    );
  }

  // Los créditos se DERIVAN del array en cada render, no se guardan aparte:
  // así el número no puede quedar desincronizado de la malla. Mientras los
  // cursos cargan se usa el total que ya trajo la sesión.
  const approvedCredits = courses.length
    ? courses
        .filter((course) => course.status === "aprobado")
        .reduce((total, course) => total + (course.credits ?? 0), 0)
    : Number(student.approved_credits ?? 0);

  return (
    <>
      <AppNavbar />

      <div className="profile-layout">
        <section className="profile-card">
          <header className="profile-card-header">
            <h2>Perfil</h2>
          </header>

          <div className="profile-card-body">
            <div className="profile-identity">
              <span className="profile-avatar">
                <User size={52} strokeWidth={1.6} />
              </span>

              <div className="profile-names">
                <h1>
                  {student.first_name} {student.last_name}
                </h1>
                <p>Registro académico {student.academic_registration}</p>
              </div>

              <div className="profile-credits">
                <span className="profile-credits-number">{approvedCredits}</span>
                <span className="profile-credits-label">Créditos aprobados</span>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <span className="profile-field-label">Correo electrónico</span>
                <span className="profile-field-value">{student.email}</span>
              </div>
              <button
                type="button"
                className="profile-edit"
                onClick={() => setEditingTab("email")}
              >
                Editar
              </button>

              <div className="profile-field">
                <span className="profile-field-label">Contraseña</span>
                <span className="profile-field-value">••••••••</span>
              </div>
              <button
                type="button"
                className="profile-edit"
                onClick={() => setEditingTab("password")}
              >
                Editar
              </button>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <header className="profile-card-header">
            <div>
              <h2>Red de estudios</h2>
              <p>
                Hacé clic en un curso para marcarlo como aprobado, cursando o pendiente.
              </p>
            </div>

            <CurriculumLegend />
          </header>

          <div className="profile-card-body">
            {loading && <p className="profile-note">Cargando la red de estudios…</p>}
            {error && <p className="profile-error">{error}</p>}
            {!loading && !error && (
              <CurriculumGrid courses={courses} onStatusChange={handleStatusChange} />
            )}
          </div>
        </section>
      </div>

      {editingTab && (
        <EditProfileModal
          currentEmail={student.email}
          initialTab={editingTab}
          onClose={() => setEditingTab(null)}
          onSaved={updateStudent}
        />
      )}
    </>
  );
}

export default MyProfile;
