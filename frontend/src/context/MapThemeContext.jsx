import { createContext, useContext, useState } from 'react'

const MapThemeContext = createContext(null)

const STORAGE_KEY = 'atlas_map_theme'

/**
 * Contexto para gestionar el tema del mapa (proveedor de tiles).
 * Persiste la preferencia en localStorage.
 */
export function MapThemeProvider({ children }) {
  const [proveedorTiles, setProveedorTiles] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'cartoDark'
    } catch {
      return 'cartoDark'
    }
  })

  const cambiarTema = (nuevoProveedor) => {
    setProveedorTiles(nuevoProveedor)
    try {
      localStorage.setItem(STORAGE_KEY, nuevoProveedor)
    } catch {
      // Ignorar errores de storage
    }
  }

  return (
    <MapThemeContext.Provider value={{ proveedorTiles, cambiarTema }}>
      {children}
    </MapThemeContext.Provider>
  )
}

export function useMapTheme() {
  const ctx = useContext(MapThemeContext)
  if (!ctx) {
    throw new Error('useMapTheme debe usarse dentro de MapThemeProvider')
  }
  return ctx
}
