import { Link } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext'
import { useMapTheme } from '../../context/MapThemeContext'
import shopIcon from '../../../assets/icons/Shop icon.png'
import atlasIcon from '../../../assets/icons/Icono atlas.png'

export default function Navbar() {
  const { usuario, logout, abrirLogin } = useUsuario()
  const { proveedorTiles, cambiarTema } = useMapTheme()

  return (
    <header className="relative z-50 flex items-center justify-between px-4 py-6 bg-carbon/95 backdrop-blur-sm border-b border-dorado/20 overflow-visible">
      {/* Logo / Título + Icono Destino */}
      <div className="flex items-center gap-4 overflow-visible">
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <img
            src={atlasIcon}
            alt="Atlas del Misterio"
            className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
          />
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
          className="relative z-50 flex flex-col items-center overflow-visible"
          
        >
          <span className="text-4xl inline-block">
            ☠
          </span>
          <span className="text-xs text-dorado/70 font-misterio tracking-wider mt-1">
           Destino
          </span>
        </Link>

        {/* Icono Tienda externa */}
        <a
          href="https://entre-misterios-shop.fourthwall.com/en-eur"
          target="_blank"
          rel="noreferrer"
          className="relative z-50 flex flex-col items-center overflow-visible"
         
        >
          <img
            src={shopIcon}
            alt="Tienda"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xs text-dorado/70 font-misterio tracking-wider mt-1">
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