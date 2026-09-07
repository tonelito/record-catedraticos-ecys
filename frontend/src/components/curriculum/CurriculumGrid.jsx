import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import CourseTile from "./CourseTile.jsx";
import SemesterColumn from "./SemesterColumn.jsx";
import StatusPopover from "./StatusPopover.jsx";
import "./CurriculumGrid.css";

// Agrupa los 75 cursos por semestre. Vienen ya ordenados por (semester, code)
// desde el backend, así que dentro de cada grupo el orden se respeta solo.
function groupBySemester(courses) {
  const groups = {};

  courses.forEach((course) => {
    if (!groups[course.semester]) groups[course.semester] = [];
    groups[course.semester].push(course);
  });

  return groups;
}

function sumCredits(courses) {
  return courses.reduce((total, course) => total + (course.credits ?? 0), 0);
}

// La malla completa. Recibe los cursos ya cargados; no pide nada por su cuenta,
// porque la misma cuadrícula sirve para el perfil propio (GET /profile/courses)
// y para el ajeno (GET /students/:registro/courses).
//
// Si no recibe `onStatusChange`, es de solo lectura: los tiles no se pueden
// clicar y no aparece el popover.
function CurriculumGrid({ courses, onStatusChange }) {
  const editable = typeof onStatusChange === "function";

  const [openCode, setOpenCode] = useState(null);
  const [savingCode, setSavingCode] = useState(null);
  const [error, setError] = useState(null);

  const gridRef = useRef(null);

  // Cerrar el popover al presionar Escape o al hacer clic fuera de cualquier
  // tile. Un solo listener para toda la malla, en vez de uno por curso.
  useEffect(() => {
    if (openCode === null) return;

    function handlePointerDown(event) {
      // Los clics sobre un tile (o sobre el propio popover, que vive dentro de
      // su wrapper) no cierran nada aquí: de eso se encarga el toggle del tile
      // o la selección de una opción.
      if (!event.target.closest?.(".course-tile-wrapper")) setOpenCode(null);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpenCode(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openCode]);

  async function handleSelect(code, status) {
    setOpenCode(null);
    setSavingCode(code);
    setError(null);

    try {
      await onStatusChange(code, status);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCode(null);
    }
  }

  const semesters = groupBySemester(courses);
  const semesterNumbers = Object.keys(semesters)
    .map(Number)
    .sort((a, b) => a - b);

  // La barra de abajo no es decorativa: es el avance real en créditos.
  const totalCredits = sumCredits(courses);
  const approvedCredits = sumCredits(
    courses.filter((course) => course.status === "aprobado"),
  );
  const progress = totalCredits
    ? Math.round((approvedCredits / totalCredits) * 100)
    : 0;

  return (
    <div className="curriculum">
      {error && <p className="curriculum-error">{error}</p>}

      <div className="curriculum-strip" ref={gridRef}>
        {semesterNumbers.map((semester) => (
          <SemesterColumn key={semester} semester={semester}>
            {semesters[semester].map((course) => (
              <CourseTile
                key={course.code}
                course={course}
                status={course.status}
                onClick={
                  editable
                    ? () =>
                        setOpenCode((previous) =>
                          previous === course.code ? null : course.code,
                        )
                    : undefined
                }
              >
                {openCode === course.code && (
                  <StatusPopover
                    status={course.status}
                    disabled={savingCode === course.code}
                    onSelect={(status) => handleSelect(course.code, status)}
                  />
                )}
              </CourseTile>
            ))}
          </SemesterColumn>
        ))}
      </div>

      <div className="curriculum-footer">
        <span className="curriculum-hint">
          <ArrowRight size={13} strokeWidth={2.2} />
          Desplazate a la derecha para ver los 10 semestres
        </span>

        <span className="curriculum-progress" title={`${progress}% de los créditos`}>
          <span className="curriculum-progress-fill" style={{ width: `${progress}%` }} />
        </span>
      </div>
    </div>
  );
}

export default CurriculumGrid;
