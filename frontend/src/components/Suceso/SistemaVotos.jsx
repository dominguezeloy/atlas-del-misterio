import { useState } from 'react'
import { useUsuario } from '../../context/UsuarioContext'
import { votar as votarApi } from '../../services/api'
import Estrellas from '../UI/Estrellas'

/**
 * Sistema de votación por estrellas (1-5).
 * Muestra la valoración media actual y permite votar si el usuario está identificado.
 *
 * @param {Object} props.suceso - Suceso con valoracion_media, total_votos, id
 */
export default function SistemaVotos({ suceso }) {
  const { usuario, abrirLogin } = useUsuario()

  const [valoracionMedia, setValoracionMedia] = useState(suceso.valoracion_media ?? 0)
  const [totalVotos, setTotalVotos] = useState(suceso.total_votos ?? 0)
  const [miVoto, setMiVoto] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleVotar = async (puntuacion) => {
    if (!usuario) {
      abrirLogin()
      return
    }

    setLoading(true)
    setError(null)
    setExito(false)

    try {
      const { data } = await votarApi(usuario.id, suceso.id, puntuacion)
      setMiVoto(puntuacion)
      setValoracionMedia(data.valoracion_media)
      setTotalVotos(data.total_votos)
      setExito(true)
      setTimeout(() => setExito(false), 3000)
    } catch (err) {
      setError(
        err.response?.data?.error || 'No se pudo registrar el voto. Inténtalo de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel-oscuro p-6">
      {/* Valoración media actual */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="font-misterio text-5xl text-dorado leading-none">
            {valoracionMedia || '–'}
          </div>
          <div className="text-dorado/40 text-xs font-misterio tracking-wider mt-1">
            DE 5
          </div>
        </div>
        <div>
          <Estrellas valor={Math.round(valoracionMedia)} tamano="lg" />
          <p className="text-dorado/50 text-sm font-cuerpo mt-1">
            {totalVotos === 0
              ? 'Sé el primero en valorar este suceso'
              : `Basado en ${totalVotos} valoración${totalVotos !== 1 ? 'es' : ''}`
            }
          </p>
        </div>
      </div>

      <div className="separador-dorado" />

      {/* Sección de votación */}
      <div className="mt-4">
        {usuario ? (
          <>
            <p className="text-dorado/70 text-sm font-cuerpo mb-3">
              {miVoto > 0
                ? `Tu valoración: ${miVoto} estrella${miVoto !== 1 ? 's' : ''} — puedes cambiarla`
                : '¿Qué te parece este suceso?'
              }
            </p>
            <div className="flex items-center gap-4">
              <Estrellas
                valor={miVoto}
                interactivo
                tamano="lg"
                onChange={handleVotar}
              />
              {loading && (
                <div className="w-4 h-4 border-2 border-dorado border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {exito && (
              <p className="mt-3 text-emerald-400 text-sm font-cuerpo animate-aparecer">
                ✓ Valoración registrada. ¡Gracias, {usuario.nick}!
              </p>
            )}
            {error && (
              <p className="mt-3 text-red-400 text-sm font-cuerpo">{error}</p>
            )}
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-dorado/60 text-sm font-cuerpo mb-3">
              Identifícate para valorar este suceso
            </p>
            <button
              onClick={abrirLogin}
              className="btn-dorado-outline"
            >
              Identificarse para votar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
