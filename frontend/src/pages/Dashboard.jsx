import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, SlidersHorizontal } from "lucide-react";
import AppNavbar from "../components/layout/AppNavbar.jsx";
import PostCard from "../components/feed/PostCard.jsx";
import SearchableSelect from "../components/ui/SearchableSelect.jsx";
import { api } from "../api/client.js";
import "./Dashboard.css";

const AREAS = [
  {
    value: "metodologia",
    label: "Metodología de Sistemas",
    color: "var(--area-metodologia)",
  },
  {
    value: "desarrollo",
    label: "Desarrollo de Software",
    color: "var(--area-desarrollo)",
  },
  {
    value: "ciencias",
    label: "Ciencias de la Computación",
    color: "var(--area-ciencias)",
  },
];

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);

  const [courseCode, setCourseCode] = useState(null);
  const [professorId, setProfessorId] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // El pensum no cambia: se pide una sola vez.
  useEffect(() => {
    api
      .get("/courses")
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  // La lista de catedráticos depende del curso elegido.
  useEffect(() => {
    const path = courseCode
      ? `/professors?courseCode=${courseCode}`
      : "/professors";
    api
      .get(path)
      .then(setProfessors)
      .catch(() => setProfessors([]));
  }, [courseCode]);

  // El feed se vuelve a pedir cada vez que cambia un filtro.
  useEffect(() => {
    const params = new URLSearchParams();
    if (courseCode) params.set("courseCode", courseCode);
    if (professorId) params.set("professorId", professorId);

    const query = params.toString();

    // Si el usuario cambia de filtro antes de que llegue esta respuesta, la
    // descartamos: una petición vieja y lenta no debe pisar a una más nueva.
    let ignore = false;

    api
      .get(query ? `/posts?${query}` : "/posts")
      .then((data) => {
        if (!ignore) setPosts(data);
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
  }, [courseCode, professorId]);

  function startFilterChange() {
    setLoading(true);
    setError(null);
  }

  function handleCourseChange(value) {
    startFilterChange();
    setCourseCode(value);
    // El catedrático elegido puede no dar el curso nuevo: se limpia.
    setProfessorId(null);
  }

  function handleProfessorChange(value) {
    startFilterChange();
    setProfessorId(value);
  }

  const courseOptions = [
    { value: null, label: "todos" },
    ...courses.map((course) => ({
      value: course.code,
      label: `${course.code} · ${course.name}`,
    })),
  ];

  const professorOptions = [
    { value: null, label: "todos" },
    ...professors.map((professor) => ({
      value: professor.id,
      label: professor.complete_name,
    })),
  ];

  return (
    <>
      <AppNavbar />

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <button
            type="button"
            className="dashboard-sidebar-button dashboard-sidebar-button--soft"
            title={filtersVisible ? "Ocultar filtros" : "Mostrar filtros"}
            onClick={() => setFiltersVisible((previous) => !previous)}
          >
            <SlidersHorizontal size={18} strokeWidth={2.1} />
          </button>

          <Link
            to="/posts/new"
            className="dashboard-sidebar-button dashboard-sidebar-button--primary"
            title="Crear publicación"
          >
            <Plus size={18} strokeWidth={2.4} />
          </Link>

          <div className="dashboard-sidebar-rule" />

          {AREAS.map((area) => (
            <span
              key={area.value}
              className="dashboard-area-swatch"
              style={{ background: area.color }}
              title={area.label}
            />
          ))}
        </aside>

        <main className="dashboard">
          {filtersVisible && (
            <div className="dashboard-filters">
              <span className="dashboard-filters-label">Filtrar</span>

              <SearchableSelect
                variant="pill"
                label="Curso"
                value={courseCode}
                options={courseOptions}
                onChange={handleCourseChange}
              />

              <SearchableSelect
                variant="pill"
                label="Catedrático"
                value={professorId}
                options={professorOptions}
                onChange={handleProfessorChange}
              />

              <span className="dashboard-filters-spacer" />

              <span className="dashboard-count">
                {posts.length}{" "}
                {posts.length === 1 ? "publicación" : "publicaciones"}
              </span>
            </div>
          )}

          {loading && <p className="dashboard-note">Cargando publicaciones…</p>}
          {error && <p className="dashboard-error">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <p className="dashboard-note">
              No hay publicaciones con esos filtros.
            </p>
          )}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
      </div>
    </>
  );
}

export default Dashboard;
