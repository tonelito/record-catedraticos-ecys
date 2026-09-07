import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import AppNavbar from "../../components/layout/AppNavbar.jsx";
import SearchableSelect from "../../components/ui/SearchableSelect.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { api } from "../../api/client.js";
import "./CreatePost.css";

const MAX_CONTENT = 1500;

function CreatePost() {
  const navigate = useNavigate();
  const { student } = useSession();

  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);

  const [courseCode, setCourseCode] = useState(null);
  const [professorId, setProfessorId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // El pensum no cambia: se pide una sola vez.
  useEffect(() => {
    api
      .get("/courses")
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  // La lista de catedráticos depende del curso elegido: sin curso no hay
  // a quién elegir, así que ni siquiera se pide. Vaciar la lista al cambiar de
  // curso es trabajo del manejador del evento, no del efecto.
  useEffect(() => {
    if (!courseCode) return;

    api
      .get(`/professors?courseCode=${courseCode}`)
      .then(setProfessors)
      .catch(() => setProfessors([]));
  }, [courseCode]);

  const courseOptions = courses.map((course) => ({
    value: course.code,
    label: `${course.code} · ${course.name}`,
  }));

  const professorOptions = [
    { value: null, label: "Sin catedrático" },
    ...professors.map((professor) => ({
      value: professor.id,
      label: professor.complete_name,
    })),
  ];

  function handleCourseChange(value) {
    setCourseCode(value);
    // El catedrático elegido puede no dar el curso nuevo: se limpian tanto la
    // selección como la lista vieja, mientras llega la del curso nuevo.
    setProfessorId(null);
    setProfessors([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !courseCode || !content.trim()) {
      setError("El título, el curso y el contenido son obligatorios.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/posts", {
        courseCode,
        professorId,
        title: title.trim(),
        content: content.trim(),
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <AppNavbar />

      <div className="create-post-layout">
        <form className="create-post-card" onSubmit={handleSubmit}>
          <header className="create-post-header">
            <h1>Crear una publicación</h1>
            <p>Compartí tu experiencia con un curso o un catedrático de ECYS.</p>
          </header>

          <div className="create-post-body">
            <label className="create-post-field">
              <span className="create-post-label">Título</span>
              <input
                type="text"
                className="create-post-input"
                placeholder="¿Sobre qué querés escribir?"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <div className="create-post-grid">
              <div className="create-post-field">
                <span className="create-post-label">
                  Curso <span className="create-post-required">*</span>
                </span>
                <SearchableSelect
                  variant="field"
                  label="Curso"
                  value={courseCode}
                  options={courseOptions}
                  onChange={handleCourseChange}
                  placeholder="Elegí un curso"
                  highlight
                />
              </div>

              <div className="create-post-field">
                <span className="create-post-label">
                  Catedrático <span className="create-post-optional">(opcional)</span>
                </span>
                <SearchableSelect
                  variant="field"
                  label="Catedrático"
                  value={professorId}
                  options={professorOptions}
                  onChange={setProfessorId}
                  placeholder={
                    courseCode ? "Elegí un catedrático" : "Elegí primero un curso"
                  }
                />
              </div>
            </div>

            <label className="create-post-field">
              <span className="create-post-label">Contenido</span>
              <textarea
                className="create-post-textarea"
                placeholder="Contá cómo lleva el curso, cómo evalúa, qué recomendarías…"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={MAX_CONTENT}
              />
              <span className="create-post-counter">
                {content.length} / {MAX_CONTENT}
              </span>
            </label>

            <p className="create-post-authorship">
              <Info size={15} strokeWidth={2} />
              <span>
                Se publicará como{" "}
                <strong>
                  {student.first_name} {student.last_name} ·{" "}
                  {student.academic_registration}
                </strong>{" "}
                con la fecha de hoy.
              </span>
            </p>

            {error && <p className="create-post-error">{error}</p>}
          </div>

          <footer className="create-post-footer">
            <button
              type="button"
              className="create-post-cancel"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
            <button type="submit" className="create-post-submit" disabled={submitting}>
              Publicar
            </button>
          </footer>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
