import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiUser,
  FiMail,
  FiMapPin,
  FiBook,
  FiCalendar,
  FiHash,
  FiShield,
} from "react-icons/fi"
import { useSelector } from "react-redux"
import {
  selectUserId,
  selectToken,
  selectIsAuthenticated,
} from "../signin/slices/loginSelectors" // ajusta si tu ruta es distinta

/* ─────────────────────────────────────────────
   Helpers UI
───────────────────────────────────────────── */
const Field = ({
  icon: Icon,
  label,
  value,
  editing,
  name,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div className="sp-field">
    <div className="sp-field__label">
      <Icon size={13} />
      <span>{label}</span>
    </div>

    {editing ? (
      <input
        className="sp-field__input"
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        autoComplete="off"
        disabled={disabled}
      />
    ) : (
      <p className="sp-field__value">{value || "—"}</p>
    )}
  </div>
)

const Pill = ({ children }) => <span className="sp-pill">{children}</span>

const DocenteProfile = () => {
  const fileRef = useRef(null)

  // auth
  const userId = useSelector(selectUserId)
  const token = useSelector(selectToken)
  const isAuthed = useSelector(selectIsAuthenticated)

  // data state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [data, setData] = useState(null)
  const [draft, setDraft] = useState(null)
  const [editing, setEditing] = useState(false)

  // avatar (solo UI por ahora)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchPerfil() {
      if (!isAuthed || !userId || !token) {
        if (mounted) {
          setLoading(false)
          setError("No hay sesión activa.")
        }
        return
      }

      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          `http://localhost:3000/api/usuarios/perfil/${userId}`,
          {
            headers: { "x-token": token },
          }
        )

        const json = await res.json()

        if (!res.ok || !json?.ok) {
          throw new Error(json?.msg || "No se pudo cargar el perfil.")
        }

        const u = json.usuario || {}
        const d = json.docente || null

        // Si este componente es SOLO para docentes, valida eso:
        if (!d) {
          throw new Error("Este perfil no corresponde a un docente.")
        }

        const fullName = [u.nombres, u.apellido_paterno, u.apellido_materno]
          .filter(Boolean)
          .join(" ")

        const normalized = {
          id_persona: u.id_persona ?? "",
          nombres: u.nombres ?? "",
          apellido_paterno: u.apellido_paterno ?? "",
          apellido_materno: u.apellido_materno ?? "",
          nombreCompleto: fullName || u.nombres || "—",

          mail: u.mail ?? "",
          ci: u.ci ?? "",
          genero: u.genero ?? "",
          fecha_nacimiento: u.fecha_nacimiento ?? "",
          estado_usuario: u.estado ?? true,
          admin: u.admin ?? false,

          // docente
          id_docente: d?.id_docente ?? "",
          titulo_docente: d?.titulo ?? "",
          tipo_docente: d?.tipo_docente ?? "",
          estado_docente: d?.estado ?? null,

          tipo: "DOCENTE",
          avatar: null,
        }

        if (mounted) {
          setData(normalized)
          setDraft(normalized)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setLoading(false)
          setError(err?.message || "Error al cargar el perfil.")
        }
      }
    }

    fetchPerfil()
    return () => {
      mounted = false
    }
  }, [isAuthed, userId, token])

  const roleLabel = useMemo(() => {
    if (!data) return "Docente"
    return "Docente"
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDraft((d) => ({ ...d, [name]: value }))
  }

  const startEdit = () => {
    if (!data) return
    setDraft(data)
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setPreview(null)
    setDraft(data)
  }

  // Guardar (por ahora solo UI)
  const save = () => {
    setData((prev) => ({
      ...draft,
      avatar: preview ?? prev?.avatar ?? null,
    }))
    setEditing(false)
    setPreview(null)
  }

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const avatarSrc = editing
    ? preview ?? draft?.avatar ?? data?.avatar
    : data?.avatar

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        Cargando perfil...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        {error}
      </div>
    )
  }

  if (!data || !draft) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        No hay datos para mostrar.
      </div>
    )
  }

  return (
    <>
      <style>{`
        /* =========================================================
           TIPOGRAFÍA: todo el componente usa SYSTEM FONT
           (para que NO "choque" con el theme)
        ========================================================= */
        .sp-root,
        .sp-root *{
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        .sp-root{
          min-height:100%;
          padding:36px 32px;
          background:#EDEEF5;
          box-sizing:border-box;
        }

        /* Header */
        .sp-header{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:18px;
          max-width:980px;
        }
        .sp-header__pill{
          width:8px;height:24px;
          background:#4B5FD6;
          border-radius:4px;
        }
        .sp-header__title{
          font-size:30px;
          line-height:1.1;
          letter-spacing:-0.4px;
          color:#1A1F36;
          margin:0;
          font-weight:800;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
        }

        .sp-subbar{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom:18px;
          max-width:980px;
        }
        .sp-meta{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }
        .sp-pill{
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:6px 10px;
          border-radius:999px;
          background:#F3F4FB;
          border:1px solid #E5E8F6;
          color:#33406A;
          font-size:12px;
          font-weight:700;
        }
        .sp-pill b{
          font-weight:800;
          color:#1A1F36;
        }

        .sp-card{
          background:#fff;
          border-radius:18px;
          padding:34px 38px;
          box-shadow:0 4px 32px rgba(74,95,210,.07);
          display:grid;
          grid-template-columns:240px 1fr;
          gap:48px;
          max-width:980px;
          animation:sp-fade-in .35s ease;
        }
        @keyframes sp-fade-in{
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }

        .sp-left{
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:14px;
        }

        .sp-avatar-wrap{
          position:relative;
          width:168px;height:168px;
          border-radius:18px;
          background:#EEF0F8;
          overflow:hidden;
          flex-shrink:0;
          border:2px solid #E4E6F0;
        }
        .sp-avatar-wrap img{width:100%;height:100%;object-fit:cover}
        .sp-avatar-placeholder{
          width:100%;height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#9FA8C7;
        }
        .sp-avatar-overlay{
          position:absolute;inset:0;
          background:rgba(27,35,80,.45);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:4px;
          opacity:0;
          transition:opacity .2s;
          cursor:pointer;
          color:#fff;
          font-size:11px;
          font-weight:800;
          letter-spacing:.4px;
        }
        .sp-avatar-wrap:hover .sp-avatar-overlay{opacity:1}

        /* AQUÍ estaba tu “no cuadra”: lo dejamos limpio y consistente */
        .sp-name{
          font-weight:900;
          font-size:22px;
          letter-spacing:-0.35px;
          line-height:1.2;
          color:#1A1F36;
          text-align:center;
          margin:10px 0 0;
        }

        .sp-badge{
          display:inline-flex;
          align-items:center;
          gap:6px;
          background:#EEF0FB;
          color:#4B5FD6;
          font-size:11px;
          font-weight:900;
          padding:6px 12px;
          border-radius:999px;
          letter-spacing:.3px;
        }

        .sp-note{
          font-size:12px;
          color:#7B86AD;
          margin:4px 0 0;
          line-height:1.4;
          text-align:center;
        }

        .sp-right{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .sp-section-title{
          font-size:11px;
          font-weight:900;
          color:#9FA8C7;
          letter-spacing:.8px;
          text-transform:uppercase;
          margin:0 0 10px;
        }

        .sp-fields-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px 32px;
        }

        .sp-field__label{
          display:flex;
          align-items:center;
          gap:6px;
          color:#9FA8C7;
          font-size:11px;
          font-weight:900;
          letter-spacing:.5px;
          text-transform:uppercase;
          margin-bottom:6px;
        }
        .sp-field__value{
          margin:0;
          font-size:14px;
          color:#1A1F36;
          font-weight:700;
        }
        .sp-field__input{
          width:100%;
          box-sizing:border-box;
          border:1.5px solid #DDE0EF;
          border-radius:9px;
          padding:8px 12px;
          font-size:14px;
          color:#1A1F36;
          background:#F7F8FC;
          outline:none;
          transition:border-color .15s, box-shadow .15s, background .15s;
          font-weight:650;
        }
        .sp-field__input:focus{
          border-color:#4B5FD6;
          box-shadow:0 0 0 3px rgba(75,95,214,.12);
          background:#fff;
        }
        .sp-field__input:disabled{
          opacity:.7;
          cursor:not-allowed;
        }

        .sp-divider{
          width:100%;
          height:1px;
          background:#F0F1F8;
          margin:18px 0;
        }

        .sp-actions{
          display:flex;
          gap:10px;
          margin-top:2px;
          flex-wrap:wrap;
        }
        .sp-btn{
          display:inline-flex;
          align-items:center;
          gap:7px;
          padding:10px 18px;
          border-radius:10px;
          font-size:13px;
          font-weight:900;
          cursor:pointer;
          transition:all .18s;
          border:none;
          user-select:none;
        }
        .sp-btn--primary{
          background:#4B5FD6;
          color:#fff;
          box-shadow:0 3px 12px rgba(75,95,214,.3);
        }
        .sp-btn--primary:hover{
          background:#3A4EC2;
          transform:translateY(-1px);
          box-shadow:0 5px 16px rgba(75,95,214,.38);
        }
        .sp-btn--outline{
          background:transparent;
          color:#4B5FD6;
          border:1.5px solid #CBD0EC;
        }
        .sp-btn--outline:hover{background:#F0F1FB}
        .sp-btn--ghost{
          background:transparent;
          color:#9FA8C7;
          border:1.5px solid #E4E6F0;
        }
        .sp-btn--ghost:hover{background:#F7F8FC}

        @media (max-width: 760px){
          .sp-root{padding:20px 16px}
          .sp-card{
            grid-template-columns:1fr;
            gap:26px;
            padding:22px 18px;
          }
          .sp-fields-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-header">
          <div className="sp-header__pill" />
          <h1 className="sp-header__title">Mi Perfil</h1>
        </div>

        <div className="sp-subbar">
          <div className="sp-meta">
            <Pill>
              <FiHash size={14} /> <b>ID:</b> {data.id_persona}
            </Pill>
            <Pill>
              <FiShield size={14} /> <b>Tipo:</b> {roleLabel}
            </Pill>
            <Pill>
              <b>Estado:</b> {data.estado_usuario ? "Activo" : "Inactivo"}
            </Pill>
          </div>
        </div>

        <div className="sp-card">
          {/* LEFT */}
          <div className="sp-left">
            <div className="sp-avatar-wrap">
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" />
              ) : (
                <div className="sp-avatar-placeholder">
                  <FiUser size={56} />
                </div>
              )}

              {editing && (
                <div
                  className="sp-avatar-overlay"
                  onClick={() => fileRef.current?.click()}
                >
                  <FiCamera size={20} />
                  <span>Cambiar foto</span>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />

            <h2 className="sp-name">
              {editing ? draft.nombreCompleto : data.nombreCompleto}
            </h2>

            <span className="sp-badge">
              <FiBook size={12} />
              {roleLabel}
            </span>

            <p className="sp-note">
              Aquí se muestran datos del usuario y del perfil de docente.
            </p>
          </div>

          {/* RIGHT */}
          <div className="sp-right">
            <p className="sp-section-title">Información personal</p>

            <div className="sp-fields-grid">
              <Field
                icon={FiUser}
                label="Nombres"
                name="nombres"
                value={editing ? draft.nombres : data.nombres}
                editing={editing}
                onChange={handleChange}
              />
              <Field
                icon={FiUser}
                label="Apellido paterno"
                name="apellido_paterno"
                value={editing ? draft.apellido_paterno : data.apellido_paterno}
                editing={editing}
                onChange={handleChange}
              />
              <Field
                icon={FiUser}
                label="Apellido materno"
                name="apellido_materno"
                value={editing ? draft.apellido_materno : data.apellido_materno}
                editing={editing}
                onChange={handleChange}
              />
              <Field
                icon={FiMail}
                label="Correo electrónico"
                name="mail"
                value={editing ? draft.mail : data.mail}
                editing={editing}
                onChange={handleChange}
                type="email"
              />
              <Field
                icon={FiHash}
                label="CI"
                name="ci"
                value={editing ? draft.ci : data.ci}
                editing={editing}
                onChange={handleChange}
                disabled
              />
              <Field
                icon={FiUser}
                label="Género"
                name="genero"
                value={editing ? draft.genero : data.genero}
                editing={editing}
                onChange={handleChange}
              />
              <Field
                icon={FiCalendar}
                label="Fecha de nacimiento"
                name="fecha_nacimiento"
                value={editing ? draft.fecha_nacimiento : data.fecha_nacimiento}
                editing={editing}
                onChange={handleChange}
                type="date"
              />
              <Field
                icon={FiShield}
                label="Admin"
                name="admin"
                value={data.admin ? "Sí" : "No"}
                editing={false}
              />
            </div>

            <div className="sp-divider" />

            <p className="sp-section-title">Perfil de docente</p>

            <div className="sp-fields-grid">
              <Field
                icon={FiBook}
                label="Título"
                name="titulo_docente"
                value={editing ? draft.titulo_docente : data.titulo_docente}
                editing={editing}
                onChange={handleChange}
              />
              <Field
                icon={FiUser}
                label="Tipo de docente"
                name="tipo_docente"
                value={editing ? draft.tipo_docente : data.tipo_docente}
                editing={editing}
                onChange={handleChange}
              />
              <Field
                icon={FiShield}
                label="Estado docente"
                name="estado_docente"
                value={data.estado_docente ? "Activo" : "Inactivo"}
                editing={false}
              />
              <Field
                icon={FiHash}
                label="ID docente"
                name="id_docente"
                value={String(data.id_docente || "")}
                editing={false}
              />
            </div>

            <div className="sp-divider" />

            <div className="sp-actions">
              {editing ? (
                <>
                  <button
                    className="sp-btn sp-btn--primary"
                    type="button"
                    onClick={save}
                  >
                    <FiSave size={14} /> Guardar cambios
                  </button>
                  <button
                    className="sp-btn sp-btn--ghost"
                    type="button"
                    onClick={cancel}
                  >
                    <FiX size={14} /> Cancelar
                  </button>
                </>
              ) : (
                <button
                  className="sp-btn sp-btn--outline"
                  type="button"
                  onClick={startEdit}
                >
                  <FiEdit2 size={14} /> Editar perfil
                </button>
              )}
            </div>

            {editing && (
              <p className="sp-note">
                Nota: por ahora “Guardar” solo actualiza la vista. Si quieres, lo
                conectamos a tu backend con PUT /api/usuarios/:id y PUT /api/docentes/:id.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default DocenteProfile