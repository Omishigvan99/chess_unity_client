// Token management utilities

// Store token in sessionStorage
export const setAccessToken = (token) => {
    if (token) {
        sessionStorage.setItem('accessToken', token)
    }
}

// Get token from sessionStorage
export const getAccessToken = () => {
    return sessionStorage.getItem('accessToken')
}

// Remove token from sessionStorage
export const removeAccessToken = () => {
    sessionStorage.removeItem('accessToken')
}

// Get authorization headers with Bearer token
export const getAuthHeaders = (contentType = 'application/json') => {
    const token = getAccessToken()
    return token
        ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': contentType,
          }
        : {
              'Content-Type': contentType,
          }
}

// Get only the Authorization header (useful for multipart uploads)
export const getAuthHeader = () => {
    const token = getAccessToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAccessToken()
}
