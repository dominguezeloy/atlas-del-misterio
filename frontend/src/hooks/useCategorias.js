import { useState, useEffect } from 'react'
import { getCategorias } from '../services/api'

/**
 * Hook para cargar las categorías de sucesos.
 * Se llama una sola vez al montar el componente.
 *
 * @returns {{ categorias: Array, loading: boolean, error: Error|null }}
 */
export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    setLoading(true)
    getCategorias()
      .then(({ data }) => {
        if (!cancelado) {
          setCategorias(data)
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
  }, [])

  return { categorias, loading, error }
}
