const ICONOS_TIPO = {
  LIBRO:      '📚',
  REVISTA:    '📰',
  VIDEO:      '🎬',
  PODCAST:    '🎙️',
  WEB:        '🌐',
  DOCUMENTAL: '🎥',
  OTRO:       '📄',
}

/**
 * Lista de fuentes bibliográficas de un suceso.
 *
 * @param {Array} props.fuentes - Array de { id, titulo, url, tipo, tipo_display }
 */
export default function FuentesList({ fuentes }) {
  if (!fuentes || fuentes.length === 0) return null

  return (
    <div className="panel-oscuro divide-y divide-dorado/10">
      {fuentes.map((fuente) => (
        <div key={fuente.id} className="flex items-start gap-3 p-4">
          <span className="text-xl flex-shrink-0 mt-0.5">
            {ICONOS_TIPO[fuente.tipo] || ICONOS_TIPO.OTRO}
          </span>
          <div className="min-w-0">
            {fuente.url ? (
              <a
                href={fuente.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-cuerpo text-dorado-claro hover:text-dorado transition-colors leading-snug block"
              >
                {fuente.titulo}
                <span className="text-dorado/30 ml-1 text-xs">↗</span>
              </a>
            ) : (
              <span className="font-cuerpo text-dorado-claro/80 leading-snug">
                {fuente.titulo}
              </span>
            )}
            <span className="text-xs text-dorado/40 font-misterio tracking-wider mt-0.5 block">
              {fuente.tipo_display}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
