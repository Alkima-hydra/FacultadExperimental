import React, { useEffect } from "react"
import { FiShoppingCart, FiBookOpen } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"

import {
  fetchOfertaAcademicaThunk,
  addCursoToCarritoThunk,
} from "./slicesOfertaAcademica/OfertaAcademicaThunk"

import {
  selectOfertaAcademica,
  selectOfertaAcademicaLoading,
  selectOfertaAcademicaError,
} from "./slicesOfertaAcademica/OfertaAcademicaSlice"

const OfertaAcademica = () => {
  const dispatch = useDispatch()

  const cursos = useSelector(selectOfertaAcademica)
  const loading = useSelector(selectOfertaAcademicaLoading)
  const error = useSelector(selectOfertaAcademicaError)

  useEffect(() => {
    dispatch(fetchOfertaAcademicaThunk())
  }, [dispatch])

  const handleAddToCart = async (curso) => {
    try {
      const resultAction = await dispatch(
        addCursoToCarritoThunk({
          id_curso: curso.id_curso,
        })
      )

      if (addCursoToCarritoThunk.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: "success",
          title: "Agregado al carrito",
          text: "El curso se agregó correctamente al carrito.",
          confirmButtonColor: "#6D5DFD",
        })
      } else {
        throw new Error(resultAction.payload || "No se pudo agregar el curso.")
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo agregar el curso al carrito.",
        confirmButtonColor: "#6D5DFD",
      })
    }
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando oferta académica...</div>
  }

  if (error) {
    return <div style={{ padding: 24 }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1A1F36" }}>
          Oferta Académica
        </h2>
        <p style={{ marginTop: 8, color: "#667085" }}>
          Aquí puedes ver los cursos disponibles y agregarlos al carrito.
        </p>
      </div>

      {(!cursos || cursos.length === 0) ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 24,
            boxShadow: "0 4px 24px rgba(16,24,40,0.06)",
          }}
        >
          No hay cursos disponibles por ahora.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {cursos.map((curso) => (
            <div
              key={curso.id_curso}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 4px 24px rgba(16,24,40,0.06)",
                border: "1px solid #EEF2F6",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4F46E5",
                  marginBottom: 14,
                }}
              >
                <FiBookOpen size={24} />
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#1A1F36",
                }}
              >
                {curso.nombre || curso.titulo || "Curso sin nombre"}
              </h3>

              <p style={{ margin: "10px 0", color: "#667085", minHeight: 40 }}>
                {curso.descripcion || "Sin descripción disponible."}
              </p>

              <p
                style={{
                  margin: "0 0 14px 0",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Bs. {curso.precio ?? "0.00"}
              </p>

              <button
                type="button"
                onClick={() => handleAddToCart(curso)}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: 12,
                  background: "#6D5DFD",
                  color: "#fff",
                  padding: "12px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <FiShoppingCart size={16} />
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OfertaAcademica