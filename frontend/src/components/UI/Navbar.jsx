import { Link } from 'react-router-dom'
import { useUsuario } from '../../context/UsuarioContext'
import { useMapTheme } from '../../context/MapThemeContext'
import shopIcon from '../../../assets/icons/Shop icon.png'
import atlasIcon from '../../../assets/icons/Icono atlas.png'
import youtubeIcon from '../../../assets/icons/Youtube icon.png'

export default function Navbar() {
  const { usuario, logout, abrirLogin } = useUsuario()
  const { proveedorTiles, cambiarTema } = useMapTheme()

  const navItemClass =
    'relative z-50 flex flex-col items-center justify-center w-20 h-24 overflow-hidden'

  const iconBoxClass =
    'w-16 h-14 flex items-center justify-center shrink-0'

  const navTextClass =
    'h-5 text-sm text-dorado/70 font-misterio tracking-wider leading-none mt-1 flex items-center justify-center'

  return (
    <header className="relative z-50 h-28 flex items-center justify-between px-4 bg-carbon/95 backdrop-blur-sm border-b border-dorado/20 overflow-hidden">
      <div className="flex items-center gap-5 h-full overflow-hidden">

        <Link
          to="/"
          className="flex items-center gap-3 group h-full"
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

        <Link to="/destino" className={navItemClass}>
          <div className={iconBoxClass}>
            <span className="text-5xl leading-none">☠</span>
          </div>

          
        </Link>

        <a
          href="https://entre-misterios-shop.fourthwall.com/en-eur"
          target="_blank"
          rel="noreferrer"
          className={navItemClass}
        >
          <div className={iconBoxClass}>
            <img
            src={shopIcon}
            alt="Tienda"
            className="w-12 h-12 object-contain"
          />
          </div>

        </a>

        <a
          href="https://www.youtube.com/@EntreMisterio"
          target="_blank"
          rel="noreferrer"
          aria-label="Canal de YouTube"
          className={navItemClass}
        >
          <div className={iconBoxClass}>
            <img
              src={youtubeIcon}
              alt="Canal"
              className="w-14 h-14 object-contain block"
            />
          </div>

        
        </a>

      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            cambiarTema(
              proveedorTiles === 'cartoDark'
                ? 'cartoVoyager'
                : 'cartoDark'
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