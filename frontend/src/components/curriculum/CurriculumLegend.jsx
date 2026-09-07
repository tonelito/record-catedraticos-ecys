import "./CurriculumLegend.css";

const STATUSES = [
  { value: "aprobado", label: "Aprobado" },
  { value: "cursando", label: "Cursando" },
  { value: "pendiente", label: "Pendiente" },
];

const AREAS = [
  { value: "metodologia", label: "Metodología de Sistemas" },
  { value: "desarrollo", label: "Desarrollo de Software" },
  { value: "ciencias", label: "Ciencias de la Computación" },
];

// Leyenda de la malla: tres muestras del tile con cada velo y tres cuadritos
// de área. La usan igual el perfil propio y el ajeno.
function CurriculumLegend() {
  return (
    <div className="curriculum-legend">
      {STATUSES.map((item) => (
        <span key={item.value} className="curriculum-legend-item">
          <span className="curriculum-legend-tile">
            {item.value !== "pendiente" && (
              <span
                className="curriculum-legend-overlay"
                style={{ background: `var(--status-${item.value}-overlay)` }}
              />
            )}
          </span>
          {item.label}
        </span>
      ))}

      <span className="curriculum-legend-divider" />

      {AREAS.map((area) => (
        <span
          key={area.value}
          className="curriculum-legend-area"
          style={{ background: `var(--area-${area.value})` }}
          title={area.label}
        />
      ))}
    </div>
  );
}

export default CurriculumLegend;
