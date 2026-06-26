import { Link } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext'

export default function Navbar() {
  const { usuario, logout, abrirLogin } = useUsuario()

  return (
    <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-carbon/95 backdrop-blur-sm border-b border-dorado/20">
      {/* Logo / Título */}
      <Link
        to="/"
        className="flex items-center gap-3 group"
      >
        <span className="text-2xl">🗺️</span>
        <div>
          <h1 className="font-misterio text-dorado-claro text-lg sm:text-xl leading-tight tracking-widest uppercase">
            Atlas del Misterio
          </h1>
          <p className="text-dorado/60 text-xs tracking-wider hidden sm:block">
            Mapa Paranormal de España
          </p>
        </div>
      </Link>

      {/* Área de usuario */}
      <div className="flex items-center gap-3">
        {usuario ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-dorado/80 font-cuerpo">
                {usuario.nick}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-xs text-dorado/50 hover:text-dorado transition-colors border border-dorado/20 hover:border-dorado/50 px-3 py-1.5 rounded-lg font-misterio tracking-wider"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </>
        ) : (
          <button
            onClick={abrirLogin}
            className="btn-dorado-outline text-xs px-4 py-2"
          >
            Identificarse
          </button>
        )}
      </div>
    </header>
  )
}
