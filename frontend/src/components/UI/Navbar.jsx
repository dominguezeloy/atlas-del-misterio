import { Link } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext'

export default function Navbar() {
  const { usuario, logout, abrirLogin } = useUsuario()

  return (
    <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-carbon/95 backdrop-blur-sm border-b border-dorado/20">
      {/* Logo / Título + Icono Destino */}
      <div className="flex items-center gap-4">
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

        {/* Icono Calculadora del Destino */}
        <Link
          to="/destino"
          className="relative group"
          title="Calcula tu destino"
        >
          <span className="text-2xl transition-all duration-300 group-hover:text-yellow-500 group-hover:scale-125 inline-block">
            ☠
          </span>
          {/* Tooltip */}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black border border-yellow-600 text-yellow-500 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-cuerpo">
            Calcula tu destino
          </span>
        </Link>
      </div>

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
