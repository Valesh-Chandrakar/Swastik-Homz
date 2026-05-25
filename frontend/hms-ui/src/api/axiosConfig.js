import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('hms_auth') || 'null')
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
    // Profile lookups 404 normally for newly-registered users — handled in-page.
    const isProfileLookup = /\/users\/auth\/\d+/.test(url) && error.config?.method === 'get'
    const silentEndpoint = isAuthEndpoint || isProfileLookup

    // CRITICAL: only force-redirect to /login if user actually has a (now-invalid) token
    // AND is not already on a public page. Otherwise we get an infinite redirect loop
    // (login page tries to load hostels → gets 401 → redirects to login → repeat forever).
    if (error.response?.status === 401 && !silentEndpoint) {
      const hadToken = !!JSON.parse(localStorage.getItem('hms_auth') || 'null')?.token
      const currentPath = window.location.pathname
      const onPublicPage = currentPath === '/login' || currentPath === '/register'

      if (hadToken && !onPublicPage) {
        localStorage.removeItem('hms_auth')
        window.location.href = '/login'
      }
    }

    // Skip global toast for auth + profile-lookup endpoints
    if (!silentEndpoint) {
      const message = error.response?.data?.message || 'An error occurred'
      // Stable id per URL so StrictMode's double-invoke replaces the existing toast
      toast.error(message, { id: `api-error:${url}` })
    }
    return Promise.reject(error)
  }
)

export default api
