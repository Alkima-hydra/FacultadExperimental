import { createSlice } from "@reduxjs/toolkit"

const STORAGE_KEY = "auth_user_v1"

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const user = JSON.parse(raw)

    // opcional: si está expirado, lo limpiamos
    if (user?.expiresAt && Date.now() > user.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return user
  } catch {
    return null
  }
}

function saveStoredUser(user) {
  try {
    if (!user) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

const storedUser = loadStoredUser()

const initialState = {
  user: storedUser || {
    id: null,
    mail: "",
    nombres: "",
    admin: false,
    rol: "",
    token: null,
    expiresAt: null,
  },
  isLoading: false,
  error: null, // puedes guardar string o {message,type} si quieres
}

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout(state) {
      state.user = {
        id: null,
        mail: "",
        nombres: "",
        admin: false,
        rol: "",
        token: null,
        expiresAt: null,
      }
      state.isLoading = false
      state.error = null
      saveStoredUser(null)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // sin import circular: usamos action type string
      .addCase("login/loginUser/pending", (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase("login/loginUser/fulfilled", (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
        saveStoredUser(action.payload)
      })
      .addCase("login/loginUser/rejected", (state, action) => {
        state.isLoading = false
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "No se pudo iniciar sesión."
      })
  },
})

export const { logout, clearError } = loginSlice.actions
export default loginSlice.reducer