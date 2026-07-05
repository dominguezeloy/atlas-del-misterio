import { Link } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext'
import { useMapTheme } from '../../context/MapThemeContext'
import shopIcon from '../../../assets/icons/Shop icon.png'

export default function Navbar() {
  const { usuario, logout, abrirLogin } = useUsuario()
  const { proveedorTiles, cambiarTema } = useMapTheme()

  return (
    <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-carbon/95 backdrop-blur-sm border-b border-dorado/20 overflow-visible">
      {/* Logo / Título + Icono Destino */}
      <div className="flex items-center gap-4 overflow-visible">
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
          className="relative z-50 group overflow-visible"
        >
          <span className="text-2xl transition-all duration-300 group-hover:text-yellow-500 group-hover:scale-125 inline-block">
            ☠
          </span>

          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 px-3 py-1.5 bg-black border border-yellow-600 text-yellow-500 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-cuerpo shadow-lg">
            Calcula tu destino
          </span>
        </Link>

        {/* Icono Tienda externa */}
        <a
          href="https://entre-misterios-shop.fourthwall.com/en-eur"
          target="_blank"
          rel="noreferrer"
          className="relative z-50 group overflow-visible"
        >
          <img
            src={shopIcon}
            alt="Tienda"
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />

          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 px-3 py-1.5 bg-black border border-dorado/40 text-dorado-claro text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-cuerpo shadow-lg">
            Tienda
          </span>
        </a>
      </div>

      {/* Área de usuario */}
      <div className="flex items-center gap-3">
        {/* Botón cambio de tema */}
        <button
          onClick={() =>
            cambiarTema(
              proveedorTiles === 'cartoDark' ? 'cartoVoyager' : 'cartoDark'
            )
          }
          className="text-xs text-dorado/50 hover:text-dorado transition-colors border border-dorado/20 hover:border-dorado/50 px-3 py-1.5 rounded-lg font-misterio tracking-wider"
          title={
            proveedorTiles === 'cartoDark'
              ? 'Cambiar a tema claro'
              : 'Cambiar a tema oscuro'
          }
        >
          {proveedorTiles === 'cartoDark' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>

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