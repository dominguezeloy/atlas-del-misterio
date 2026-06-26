import { useState, useEffect, useCallback } from 'react'
import { getSucesos, getSuceso } from '../services/api'

/**
 * Hook para cargar la lista de sucesos del mapa con filtros opcionales.
 *
 * @param {Object} filtros - { categoria?, provincia?, comunidad?, search? }
 * @returns {{ sucesos, loading, error, recargar }}
 */
export function useSucesos(filtros = {}) {
  const [sucesos, setSucesos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Serializamos los filtros para poder usarlos como dependencia del efecto
  const filtrosKey = JSON.stringify(filtros)

  const cargar = useCallback(() => {
    let cancelado = false
    setLoading(true)
    setError(null)
    getSucesos(JSON.parse(filtrosKey))
      .then(({ data }) => {
        if (!cancelado) {
          // La API puede devolver array directo (sin paginación) o { results: [] }
          setSucesos(Array.isArray(data) ? data : (data.results ?? []))
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err)
          setLoading(false)
        }
      })
    return () => { cancelado = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosKey])

  useEffect(() => {
    const cleanup = cargar()
    return cleanup
  }, [cargar])

  return { sucesos, loading, error, recargar: cargar }
}

/**
 * Hook para cargar un único suceso por su slug.
 *
 * @param {string} slug
 * @returns {{ suceso, loading, error }}
 */
export function useSuceso(slug) {
  const [suceso, setSuceso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelado = false
    setLoading(true)
    setError(null)
    getSuceso(slug)
      .then(({ data }) => {
        if (!cancelado) {
          setSuceso(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err)
          setLoading(false)
        }
      })
    return () => { cancelado = true }
  }, [slug])

  return { suceso, loading, error }
}
