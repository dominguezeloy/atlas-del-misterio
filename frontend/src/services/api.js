import axios from 'axios'

/**
 * Instancia centralizada de Axios para el Atlas del Misterio.
 *
 * - baseURL: '/api' → el proxy de Vite redirige al backend Django en dev.
 *   En producción, configura Nginx para hacer lo mismo.
 *
 * FUTURE: Para autenticación JWT completa:
 * 1. Instala: pip install djangorestframework-simplejwt (backend)
 * 2. Al hacer login, guarda el access token en localStorage
 * 3. El interceptor inyecta: Authorization: Bearer <token>
 * 4. Añade un interceptor de respuesta para refrescar el token expirado
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de petición: inyecta el ID del usuario identificado
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('atlas_usuario')
  if (raw) {
    try {
      const usuario = JSON.parse(raw)
      if (usuario?.id) {
        config.headers['X-Usuario-Id'] = String(usuario.id)
      }
      // FUTURE: JWT → config.headers['Authorization'] = `Bearer ${usuario.token}`
    } catch {
      // Si localStorage está corrupto, lo ignoramos silenciosamente
      localStorage.removeItem('atlas_usuario')
    }
  }
  return config
})

// ── Categorías ────────────────────────────────────────────────────────────────
export const getCategorias = () =>
  api.get('/categorias/')

// ── Sucesos ───────────────────────────────────────────────────────────────────
/**
 * @param {Object} filtros - { categoria, provincia, comunidad, search, ordering }
 */
export const getSucesos = (filtros = {}) => {
  const params = {}
  if (filtros.categoria) params.categoria = filtros.categoria
  if (filtros.provincia) params.provincia = filtros.provincia
  if (filtros.comunidad) params.comunidad = filtros.comunidad
  if (filtros.search)    params.search    = filtros.search
  if (filtros.ordering)  params.ordering  = filtros.ordering
  return api.get('/sucesos/', { params })
}

export const getSuceso = (slug) =>
  api.get(`/sucesos/${slug}/`)

export const getValoracionSuceso = (slug) =>
  api.get(`/sucesos/${slug}/valoracion/`)

// ── Autenticación ─────────────────────────────────────────────────────────────
/**
 * Login sin contraseña (MVP).
 * Si el email ya existe, reutiliza el usuario.
 * Si no, lo crea.
 */
export const loginSimple = (nick, email) =>
  api.post('/login-simple/', { nick, email })

// ── Votos ─────────────────────────────────────────────────────────────────────
export const votar = (usuarioId, sucesoId, puntuacion) =>
  api.post('/votar/', {
    usuario_id: usuarioId,
    suceso_id:  sucesoId,
    puntuacion,
  })

// ── Favoritos ─────────────────────────────────────────────────────────────────
/** Toggle: añade si no existe, elimina si existe */
export const toggleFavorito = (usuarioId, sucesoId) =>
  api.post('/favorito/', {
    usuario_id: usuarioId,
    suceso_id:  sucesoId,
  })

export const getMisFavoritos = (usuarioId) =>
  api.get('/favoritos/', { params: { usuario_id: usuarioId } })

export default api
