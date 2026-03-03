export const selectUser = (state) => state.login.user
export const selectIsLoading = (state) => state.login.isLoading
export const selectError = (state) => state.login.error

export const selectUserId = (state) => state.login.user?.id ?? null
export const selectToken = (state) => state.login.user?.token ?? null

export const selectIsAdmin = (state) => {
  const admin = state.login.user?.admin
  return admin === true || admin === 1 || admin === "true"
}

export const selectIsAuthenticated = (state) => {
  const token = state.login.user?.token
  const id = state.login.user?.id
  const expiresAt = state.login.user?.expiresAt
  if (!token || !id) return false
  if (expiresAt && Date.now() > expiresAt) return false
  return true
}