import { useState, useEffect, useRef } from 'react'
import { useUsuario } from '../../context/UsuarioContext'

/**
 * Modal de identificación simple (MVP sin contraseñas).
 * Controlado desde UsuarioContext (showLoginModal).
 *
 * Se renderiza en App.jsx para estar disponible globalmente.
 */
export default function LoginSimple() {
  const { showLoginModal, cerrarLogin, login, loginLoading, loginError } = useUsuario()
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')
  const nickRef = useRef(null)

  // Foco automático al abrir el modal
  useEffect(() => {
    if (showLoginModal && nickRef.current) {
      setTimeout(() => nickRef.current?.focus(), 50)
    }
  }, [showLoginModal])

  // Limpiar campos al abrir
  useEffect(() => {
    if (showLoginModal) {
      setNick('')
      setEmail('')
    }
  }, [showLoginModal])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') cerrarLogin() }
    if (showLoginModal) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showLoginModal, cerrarLogin])

  if (!showLoginModal) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nick.trim() || !email.trim()) return
    try {
      await login(nick.trim(), email.trim())
    } catch {
      // El error ya está en loginError del contexto
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-aparecer"
      onClick={cerrarLogin}
    >
      <div
        className="panel-oscuro p-6 sm:p-8 w-full max-w-md animate-deslizar-up shadow-dorado-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="titulo-misterio text-xl mb-2">Identificarse</h2>
          <p className="text-dorado/60 text-sm font-cuerpo">
            Introduce tu nick y email para votar y guardar favoritos.
            No necesitas contraseña.
          </p>
        </div>

        {/* Error */}
        {loginError && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-300 text-sm font-cuerpo">
            {loginError}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dorado/70 text-sm font-misterio tracking-wider mb-1.5">
              Nick
            </label>
            <input
              ref={nickRef}
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="Investigador del Misterio"
              maxLength={50}
              required
              className="w-full bg-carbon border border-dorado/30 focus:border-dorado rounded-lg px-4 py-2.5
                         text-dorado-claro placeholder-dorado/30 outline-none transition-colors
                         font-cuerpo text-base"
            />
          </div>

          <div>
            <label className="block text-dorado/70 text-sm font-misterio tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-carbon border border-dorado/30 focus:border-dorado rounded-lg px-4 py-2.5
                         text-dorado-claro placeholder-dorado/30 outline-none transition-colors
                         font-cuerpo text-base"
            />
          </div>

          <p className="text-dorado/40 text-xs font-cuerpo">
            Si ya te identificaste antes con ese email, reconectaremos tu cuenta.
          </p>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={cerrarLogin}
              className="flex-1 btn-dorado-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loginLoading || !nick.trim() || !email.trim()}
              className="flex-1 btn-dorado disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'Accediendo…' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
