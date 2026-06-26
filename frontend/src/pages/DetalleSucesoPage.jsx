import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/UI/Navbar'
import FichaSuceso from '../components/Suceso/FichaSuceso'
import { useSuceso } from '../hooks/useSucesos'

/**
 * Página de detalle de un suceso paranormal.
 * Ruta: /suceso/:slug
 */
export default function DetalleSucesoPage() {
  const { slug } = useParams()
  const { suceso, loading, error } = useSuceso(slug)

  return (
    <div className="min-h-screen flex flex-col bg-carbon">
      <Navbar />

      <main className="flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-10 h-10 border-2 border-dorado border-t-transparent rounded-full animate-spin" />
            <p className="font-misterio text-dorado/60 text-sm tracking-wider animate-pulse">
              Desvelando el misterio…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
            <div className="text-5xl mb-2">🔮</div>
            <h2 className="titulo-misterio text-2xl">Suceso no encontrado</h2>
            <p className="text-dorado/60 font-cuerpo text-center max-w-sm">
              {error.response?.status === 404
                ? 'Este suceso no existe o ha sido archivado.'
                : 'Error al cargar el suceso. Inténtalo de nuevo.'
              }
            </p>
            <Link to="/" className="btn-dorado-outline mt-4">
              ← Volver al mapa
            </Link>
          </div>
        )}

        {!loading && suceso && (
          <>
            {/* Migajas */}
            <nav className="max-w-4xl mx-auto px-4 pt-6 pb-2">
              <ol className="flex items-center gap-2 text-xs text-dorado/40 font-misterio tracking-wider">
                <li>
                  <Link to="/" className="hover:text-dorado transition-colors">
                    🗺️ Mapa
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    to={`/?categoria=${suceso.categoria?.slug}`}
                    className="hover:text-dorado transition-colors"
                  >
                    {suceso.categoria?.icono_emoji} {suceso.categoria?.nombre}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-dorado/70 truncate max-w-[200px]">
                  {suceso.titulo}
                </li>
              </ol>
            </nav>

            <FichaSuceso suceso={suceso} />

            {/* Pie de página de la ficha */}
            <div className="max-w-4xl mx-auto px-4 pb-12 text-center">
              <div className="separador-dorado" />
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-dorado/50 hover:text-dorado
                           font-misterio text-sm tracking-wider transition-colors"
              >
                ← Volver al Atlas del Misterio
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
