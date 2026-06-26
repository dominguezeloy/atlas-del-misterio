/**
 * Chips de filtrado por categoría para el mapa.
 *
 * @param {Object}   props
 * @param {Array}    props.categorias        - Lista de categorías del API
 * @param {string|null} props.categoriaActiva - Slug de la categoría activa (null = todas)
 * @param {Function} props.onChange          - (slug|null) => void
 */
export default function FiltrosCategorias({ categorias, categoriaActiva, onChange }) {
  if (!categorias || categorias.length === 0) return null

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] max-w-[95vw]">
      <div className="flex flex-wrap justify-center gap-2 px-3 py-2 bg-carbon/85 backdrop-blur-md rounded-2xl border border-dorado/20 shadow-misterio">
        {/* Botón "Todas" */}
        <button
          onClick={() => onChange(null)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-misterio
            tracking-wider transition-all duration-200 border
            ${!categoriaActiva
              ? 'bg-dorado text-carbon border-dorado shadow-dorado'
              : 'text-dorado/60 border-dorado/20 hover:border-dorado/50 hover:text-dorado'
            }
          `}
        >
          🗺️ Todas
        </button>

        {/* Una chip por categoría */}
        {categorias.map((cat) => {
          const activa = categoriaActiva === cat.slug
          return (
            <button
              key={cat.slug}
              onClick={() => onChange(activa ? null : cat.slug)}
              style={activa ? {
                backgroundColor: cat.color + '33',
                borderColor: cat.color,
                color: cat.color,
                boxShadow: `0 0 12px ${cat.color}44`,
              } : {}}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-misterio
                tracking-wider transition-all duration-200 border
                ${!activa ? 'text-dorado/60 border-dorado/20 hover:border-dorado/40 hover:text-dorado/80' : ''}
              `}
              title={cat.nombre}
            >
              <span>{cat.icono_emoji}</span>
              <span className="hidden sm:inline">{cat.nombre}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
