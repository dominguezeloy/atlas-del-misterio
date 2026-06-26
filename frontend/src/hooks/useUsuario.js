import { useState, useEffect, useCallback } from 'react'
import { useUsuario } from '../context/UsuarioContext'
import { getMisFavoritos } from '../services/api'

/**
 * Hook que expone el usuario activo y sus favoritos.
 * Re-exporta el contexto con utilidades adicionales.
 */
export function useUsuarioConFavoritos() {
  const ctx = useUsuario()
  const [favoritos, setFavoritos] = useState([])
  const [favoritosLoading, setFavoritosLoading] = useState(false)

  const cargarFavoritos = useCallback(async () => {
    if (!ctx.usuario) {
      setFavoritos([])
      return
    }
    setFavoritosLoading(true)
    try {
      const { data } = await getMisFavoritos(ctx.usuario.id)
      setFavoritos(data.favoritos || [])
    } catch {
      // Silencioso si falla la carga de favoritos
    } finally {
      setFavoritosLoading(false)
    }
  }, [ctx.usuario])

  useEffect(() => {
    cargarFavoritos()
  }, [cargarFavoritos])

  const esFavorito = useCallback(
    (sucesoId) => favoritos.includes(sucesoId),
    [favoritos]
  )

  const toggleLocalFavorito = useCallback((sucesoId, esFav) => {
    setFavoritos((prev) =>
      esFav ? [...prev, sucesoId] : prev.filter((id) => id !== sucesoId)
    )
  }, [])

  return {
    ...ctx,
    favoritos,
    favoritosLoading,
    esFavorito,
    toggleLocalFavorito,
    recargarFavoritos: cargarFavoritos,
  }
}
