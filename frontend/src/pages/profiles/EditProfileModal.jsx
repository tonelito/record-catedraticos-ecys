import { useState } from "react";
import Modal from "../../components/ui/Modal.jsx";
import { api } from "../../api/client.js";
import "./EditProfileModal.css";

// Modal 1j. `initialTab` decide con cuál pestaña abre, según qué botón
// "Editar" se haya presionado en el perfil.
function EditProfileModal({ currentEmail, initialTab = "email", onClose, onSaved }) {
  const [tab, setTab] = useState(initialTab);

  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cambiar de pestaña limpia lo escrito: así no se manda sin querer un campo
  // que quedó lleno en la otra.
  function changeTab(nextTab) {
    setTab(nextTab);
    setNewEmail("");
    setConfirmEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  }

  function validate() {
    if (!currentPassword) return "Ingresá tu contraseña actual para confirmar.";

    if (tab === "email") {
      if (!newEmail) return "Ingresá el nuevo correo.";
      if (newEmail !== confirmEmail) return "Los correos no coinciden.";
      if (newEmail === currentEmail) return "El nuevo correo es igual al actual.";
      return null;
    }

    if (!newPassword) return "Ingresá la nueva contraseña.";
    if (newPassword.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (newPassword !== confirmPassword) return "Las contraseñas no coinciden.";
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Solo se manda el campo de la pestaña activa, más la contraseña actual
      // que el backend exige para autorizar cualquier cambio.
      const updated = await api.patch("/profile", {
        currentPassword,
        ...(tab === "email" ? { email: newEmail } : { password: newPassword }),
      });

      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Editar mis datos"
      subtitle="Solo podés cambiar tu correo y tu contraseña."
      onClose={onClose}
    >
      <div className="edit-tabs">
        <button
          type="button"
          className={`edit-tab ${tab === "email" ? "edit-tab--active" : ""}`}
          onClick={() => changeTab("email")}
        >
          Correo
        </button>
        <button
          type="button"
          className={`edit-tab ${tab === "password" ? "edit-tab--active" : ""}`}
          onClick={() => changeTab("password")}
        >
          Contraseña
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="edit-body">
          {tab === "email" ? (
            <>
              <label className="edit-field">
                <span className="edit-label">Correo actual</span>
                <input type="email" value={currentEmail} readOnly />
              </label>

              <label className="edit-field">
                <span className="edit-label">Nuevo correo estudiantil</span>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                />
              </label>

              <label className="edit-field">
                <span className="edit-label">Confirmar nuevo correo</span>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(event) => setConfirmEmail(event.target.value)}
                />
              </label>
            </>
          ) : (
            <>
              <label className="edit-field">
                <span className="edit-label">Nueva contraseña</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>

              <label className="edit-field">
                <span className="edit-label">Confirmar nueva contraseña</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            </>
          )}

          <div className="edit-divider" />

          <label className="edit-field">
            <span className="edit-label">
              Contraseña actual <span className="edit-required">*</span>
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>

          {error && <p className="edit-error">{error}</p>}
        </div>

        <footer className="edit-footer">
          <button type="button" className="edit-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="edit-submit" disabled={saving}>
            Guardar cambios
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
