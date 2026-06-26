import { useState, useEffect } from 'react'
import { useUsuario } from '../../context/UsuarioContext'
import { toggleFavorito, getMisFavoritos } from '../../services/api'

/**
 * Botón de toggle favorito para un suceso.
 * Muestra un corazón relleno/vacío según el estado.
 *
 * @param {number} props.sucesoId - ID del suceso
 */
export default function BtnFavorito({ sucesoId }) {
  const { usuario, abrirLogin } = useUsuario()

  const [esFav, setEsFav] = useState(false)
  const [loading, setLoading] = useState(false)

  // Cargar estado inicial de favorito cuando hay usuario
  useEffect(() => {
    if (!usuario) {
      setEsFav(false)
      return
    }
    let cancelado = false
    getMisFavoritos(usuario.id)
      .then(({ data }) => {
        if (!cancelado) {
          setEsFav((data.favoritos || []).includes(sucesoId))
        }
      })
      .catch(() => {}) // Silencioso
    return () => { cancelado = true }
  }, [usuario, sucesoId])

  const handleToggle = async () => {
    if (!usuario) {
      abrirLogin()
      return
    }

    setLoading(true)
    try {
      const { data } = await toggleFavorito(usuario.id, sucesoId)
      setEsFav(data.es_favorito)
    } catch {
      // Silencioso si falla
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
        font-misterio text-sm tracking-wider
        ${esFav
          ? 'bg-red-900/30 border-red-500/60 text-red-400 hover:bg-red-900/50'
          : 'border-dorado/30 text-dorado/60 hover:border-dorado/60 hover:text-dorado'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={usuario
        ? (esFav ? 'Quitar de favoritos' : 'Añadir a favoritos')
        : 'Identifícate para guardar favoritos'
      }
      aria-label={esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="text-lg">{esFav ? '❤️' : '🤍'}</span>
      )}
      <span>{esFav ? 'Guardado' : 'Favorito'}</span>
    </button>
  )
}
