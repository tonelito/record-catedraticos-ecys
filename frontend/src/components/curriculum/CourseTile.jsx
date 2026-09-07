import "./CourseTile.css";

const STATUS_LABELS = {
  aprobado: "Aprobado",
  cursando: "Cursando",
  pendiente: "Pendiente",
};

// El tile de un curso en la red de estudios. Es puramente presentacional:
// no sabe de peticiones ni de estado global, solo dibuja lo que recibe.
//
// `children` es la ranura donde el contenedor mete el popover de estado, que
// se posiciona en absoluto contra este mismo tile.
function CourseTile({ course, status = "pendiente", onClick, children }) {
  const interactive = typeof onClick === "function";

  // En el perfil propio el tile se puede clicar (abre el popover), en el perfil
  // ajeno es solo lectura. Un <button> real trae gratis el foco por teclado y
  // que Enter/Espacio lo activen; un <div> con onClick no.
  const Element = interactive ? "button" : "div";

  const prerequisites = course.prerequisites ?? [];

  return (
    <div className="course-tile-wrapper">
      <Element
        {...(interactive ? { type: "button", onClick } : {})}
        className={`course-tile ${interactive ? "course-tile--interactive" : ""}`}
        title={`${course.code} · ${course.name} · ${STATUS_LABELS[status]}`}
      >
        {/* 1. Franja de área. Si el curso no tiene área, no se renderiza:
            no debe quedar un hueco vacío. */}
        {course.area && (
          <span
            className="course-tile-area"
            style={{ background: `var(--area-${course.area})` }}
          />
        )}

        {/* 2. Código arriba, créditos abajo. */}
        <span className="course-tile-codes">
          <span className="course-tile-code">{course.code}</span>
          <span className="course-tile-credits">{course.credits ?? "—"}</span>
        </span>

        {/* 3. Nombre. El punto final marca los cursos obligatorios, como en la
            malla oficial de ECYS. */}
        <span className="course-tile-name">
          {course.name}
          {course.is_mandatory && <span className="course-tile-dot" />}
        </span>

        {/* 4. Prerrequisitos, un código por línea. */}
        <span className="course-tile-prereqs">
          {prerequisites.length > 0 ? prerequisites.join("\n") : "—"}
        </span>

        {/* 5. Velo de estado, encima de todo. Sin la marca circular del mock:
            el verde y el azul se leen mejor solos. */}
        {status !== "pendiente" && (
          <span className={`course-tile-overlay course-tile-overlay--${status}`} />
        )}
      </Element>

      {children}
    </div>
  );
}

export default CourseTile;
