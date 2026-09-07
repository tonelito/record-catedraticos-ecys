import "./SemesterColumn.css";

const ORDINALS = [
  null,
  "PRIMER",
  "SEGUNDO",
  "TERCER",
  "CUARTO",
  "QUINTO",
  "SEXTO",
  "SÉPTIMO",
  "OCTAVO",
  "NOVENO",
  "DÉCIMO",
];

// Solo el marco de un semestre: la cabecera con el número grande y la caja de
// borde naranja. Los tiles los pone quien la usa, vía children, para que esta
// columna no tenga que saber nada de estados ni de popovers.
function SemesterColumn({ semester, children }) {
  return (
    <div className="semester-column">
      <div className="semester-header">
        <span className="semester-number">{semester}</span>
        {/* Las dos líneas ("PRIMER" / "SEMESTRE") salen del \n gracias al
            white-space: pre-line del CSS. */}
        <span className="semester-label">{`${ORDINALS[semester]}\nSEMESTRE`}</span>
      </div>

      <div className="semester-box">{children}</div>
    </div>
  );
}

export default SemesterColumn;
