import { createAsyncThunk } from "@reduxjs/toolkit"
import { loginApi } from "../../../lib/api"

function normalizeLoginResponse(res) {
  // backend actual: { ok, id, mail, nombres, admin, token }
  const ok = !!res?.ok
  const token = res?.token ?? null
  const id = res?.id ?? res?.uid ?? res?.usuario?.id ?? res?.usuario?.uid ?? null

  // nombres / name
  const nombres =
    res?.nombres ??
    res?.nombre ??
    res?.usuario?.nombres ??
    res?.usuario?.nombre ??
    "Usuario"

  // mail / email
  const mail = res?.mail ?? res?.email ?? res?.usuario?.mail ?? res?.usuario?.email ?? ""

  // admin / rol
  const admin = res?.admin ?? res?.usuario?.admin ?? false
  const rol = admin === true || admin === 1 || admin === "true" ? "Admin" : "Usuario"

  return { ok, id, mail, nombres, admin, rol, token }
}

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi.login(credentials)
      const norm = normalizeLoginResponse(response)

      if (!norm.ok || !norm.token || !norm.id) {
        return rejectWithValue({
          message: response?.msg || "Credenciales inválidas o respuesta incompleta",
          type: "warning",
        })
      }

      // Si tu backend NO manda expiresIn, usamos fallback (ej: 7h)
      const expiresInSec =
        Number(response?.expiresIn) && Number(response.expiresIn) > 0
          ? Number(response.expiresIn)
          : 7 * 60 * 60

      return {
        id: norm.id,
        mail: norm.mail,
        nombres: norm.nombres,
        admin: norm.admin,
        rol: norm.rol,
        token: norm.token,
        expiresAt: Date.now() + expiresInSec * 1000,
      }
    } catch (error) {
      // si loginApi usa axios, esto funciona
      if (error?.response) {
        const { status, data } = error.response

        if (status === 400) {
          return rejectWithValue({
            message: data?.msg || "Credenciales inválidas",
            type: "warning",
          })
        }

        if (status === 401) {
          return rejectWithValue({
            message: data?.msg || "No autorizado",
            type: "warning",
          })
        }

        if (status >= 500) {
          return rejectWithValue({
            message: "Error en el servidor. Intente más tarde",
            type: "error",
          })
        }
      }

      return rejectWithValue({
        message: error?.message || "No se pudo conectar con el servidor",
        type: "error",
      })
    }
  }
)