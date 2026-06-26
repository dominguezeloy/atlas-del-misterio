import { createContext, useContext, useState, useCallback } from 'react'
import { loginSimple as loginSimpleApi } from '../services/api'

const UsuarioContext = createContext(null)

const STORAGE_KEY = 'atlas_usuario'

function cargarDesdeStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return null
}

/**
 * Contexto global del usuario identificado.
 *
 * Estado: { id, nick, email } | null
 *
 * FUTURE: Para JWT, añade aquí:
 *   - token: el access token
 *   - tokenExpiry: fecha de expiración
 *   - refreshToken()
 *   - Gestiona el ciclo de vida del token en este provider
 */
export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(cargarDesdeStorage)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const login = useCallback(async (nick, email) => {
    setLoginLoading(true)
    setLoginError(null)
    try {
      const { data } = await loginSimpleApi(nick, email)
      const userData = { id: data.id, nick: data.nick, email: data.email }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      setUsuario(userData)
      setShowLoginModal(false)
      return userData
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'Error al identificarse. Inténtalo de nuevo.'
      setLoginError(msg)
      throw err
    } finally {
      setLoginLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUsuario(null)
  }, [])

  const abrirLogin = useCallback(() => {
    setLoginError(null)
    setShowLoginModal(true)
  }, [])

  const cerrarLogin = useCallback(() => {
    setShowLoginModal(false)
    setLoginError(null)
  }, [])

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        login,
        logout,
        showLoginModal,
        abrirLogin,
        cerrarLogin,
        loginLoading,
        loginError,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  const ctx = useContext(UsuarioContext)
  if (!ctx) {
    throw new Error('useUsuario debe usarse dentro de <UsuarioProvider>')
  }
  return ctx
}

export default UsuarioContext
