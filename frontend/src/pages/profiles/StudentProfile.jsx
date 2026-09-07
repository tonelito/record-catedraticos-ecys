import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Lock, User } from "lucide-react";
import AppNavbar from "../../components/layout/AppNavbar.jsx";
import CurriculumGrid from "../../components/curriculum/CurriculumGrid.jsx";
import CurriculumLegend from "../../components/curriculum/CurriculumLegend.jsx";
import { api } from "../../api/client.js";
import "../../styles/profile.css";
import "./StudentProfile.css";

function plural(count, one, many) {
  return `${count} ${Number(count) === 1 ? one : many}`;
}

function StudentProfile() {
  const { academicRegistration } = useParams();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      api.get(`/students/${academicRegistration}`),
      api.get(`/students/${academicRegistration}/courses`),
    ])
      .then(([studentData, coursesData]) => {
        if (ignore) return;
        setStudent(studentData);
        setCourses(coursesData);
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
  }, [academicRegistration]);

  return (
    <>
      <AppNavbar />

      <div className="profile-layout">
        <div className="student-breadcrumb">
          <Link to="/">
            <ChevronLeft size={14} strokeWidth={2.4} />
            Volver
          </Link>
          <span>·</span>
          <span>
            Resultado de búsqueda para <strong>{academicRegistration}</strong>
          </span>
        </div>

        {loading && <p className="profile-note">Cargando perfil…</p>}
        {error && <p className="profile-error">{error}</p>}

        {student && (
          <>
            <section className="profile-card">
              <header className="profile-card-header">
                <h2>Perfil</h2>
                <span className="student-badge">
                  <Lock size={13} strokeWidth={2.2} />
                  Solo lectura
                </span>
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
                    <p className="student-activity">
                      {plural(student.post_count, "publicación", "publicaciones")} ·{" "}
                      {plural(student.comment_count, "comentario", "comentarios")}
                    </p>
                  </div>

                  <div className="profile-credits">
                    <span className="profile-credits-number">
                      {student.approved_credits}
                    </span>
                    <span className="profile-credits-label">Créditos aprobados</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <header className="profile-card-header">
                <div>
                  <h2>Cursos aprobados y en curso</h2>
                  <p>
                    Así va {student.first_name} en la red de estudios de la carrera.
                  </p>
                </div>

                <CurriculumLegend />
              </header>

              <div className="profile-card-body">
                {/* Sin onStatusChange: los tiles no se pueden clicar y no hay
                    menú de estado. Es la misma malla del perfil propio. */}
                <CurriculumGrid courses={courses} />
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

export default StudentProfile;
