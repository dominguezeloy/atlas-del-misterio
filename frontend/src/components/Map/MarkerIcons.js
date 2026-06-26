import L from 'leaflet'

/**
 * Iconos de marcador personalizados por categoría de suceso.
 * Usa L.divIcon con emoji SVG, coloreados con el color de la categoría.
 *
 * @param {string} slug  - Slug de la categoría (ej: 'fantasmas')
 * @param {string} color - Color hexadecimal de la categoría (ej: '#6366F1')
 * @returns {L.DivIcon}
 */

const EMOJIS_CATEGORIA = {
  'psicofonias':          '🎙️',
  'fantasmas':            '👻',
  'casas-encantadas':     '🏚️',
  'leyendas':             '📜',
  'extraterrestres':      '👽',
  'ovnis':                '🛸',
  'criptozoologia':       '🐺',
  'objetos-malditos':     '🔮',
  'lugares-malditos':     '⚰️',
  'misterios-historicos': '📖',
  'brujeria':             '🧙',
  'apariciones-marianas': '✨',
  'otros':                '❓',
}

export function getIconByCategoriaSlug(slug, color = '#c9a84c') {
  const emoji = EMOJIS_CATEGORIA[slug] || '❓'

  return L.divIcon({
    className: '', // Sin clase base — usamos estilos inline para control total
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: ${color}22;
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 1;
        box-shadow: 0 0 12px ${color}55, 0 2px 6px rgba(0,0,0,0.6);
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        user-select: none;
      "
      onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 0 20px ${color}88, 0 4px 12px rgba(0,0,0,0.7)'"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 12px ${color}55, 0 2px 6px rgba(0,0,0,0.6)'"
      >
        ${emoji}
      </div>
    `,
    iconSize:    [38, 38],
    iconAnchor:  [19, 19],
    popupAnchor: [0, -22],
  })
}

/**
 * Icono genérico de fallback
 */
export function getIconDefault() {
  return getIconByCategoriaSlug('otros', '#374151')
}
