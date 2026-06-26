import { useState, useMemo } from 'react'
import Navbar from '../components/UI/Navbar'
import FiltrosCategorias from '../components/UI/FiltrosCategorias'
import MapaInteractivo from '../components/Map/MapaInteractivo'
import { useSucesos } from '../hooks/useSucesos'
import { useCategorias } from '../hooks/useCategorias'

/**
 * Página principal: Navbar + Mapa a pantalla completa + Filtros flotantes.
 */
export default function MapaPage() {
  const [categoriaActiva, setCategoriaActiva] = useState(null)

  // Cargar datos
  const { categorias } = useCategorias()
  const { sucesos, loading } = useSucesos()

  // Filtrado client-side por categoría activa
  const sucesosVisibles = useMemo(() => {
    if (!categoriaActiva) return sucesos
    return sucesos.filter((s) => s.categoria?.slug === categoriaActiva)
  }, [sucesos, categoriaActiva])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      {/* Mapa ocupa todo el espacio restante */}
      <div className="relative flex-1 overflow-hidden">
        <MapaInteractivo
          sucesos={sucesosVisibles}
          loading={loading}
        />

        {/* Filtros flotantes sobre el mapa */}
        <FiltrosCategorias
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onChange={setCategoriaActiva}
        />
      </div>
    </div>
  )
}
