import { useState } from 'react'

/**
 * Botones para compartir un suceso en redes sociales y por enlace.
 * Todo client-side, sin backend.
 *
 * @param {string} props.titulo - Título del suceso
 * @param {string} props.slug   - Slug del suceso (para construir la URL canónica)
 */
export default function BotonesCompartir({ titulo, slug }) {
  const [copiado, setCopiado] = useState(false)

  const url = `${window.location.origin}/suceso/${slug}`
  const textoCompartir = `${titulo} — Atlas del Misterio`

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Fallback para navegadores sin soporte de clipboard API
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    }
  }

  const compartirWhatsApp = () => {
    const texto = encodeURIComponent(`${textoCompartir}\n${url}`)
    window.open(`https://wa.me/?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  const compartirX = () => {
    const texto = encodeURIComponent(textoCompartir)
    const urlEnc = encodeURIComponent(url)
    window.open(
      `https://x.com/intent/tweet?text=${texto}&url=${urlEnc}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-dorado/40 text-xs font-misterio tracking-wider mr-1">
        COMPARTIR:
      </span>

      {/* Copiar enlace */}
      <button
        onClick={copiarEnlace}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-misterio tracking-wider
          border transition-all duration-200
          ${copiado
            ? 'bg-emerald-900/40 border-emerald-500/60 text-emerald-400'
            : 'border-dorado/30 text-dorado/60 hover:border-dorado/60 hover:text-dorado'
          }
        `}
        title="Copiar enlace al portapapeles"
      >
        {copiado ? '✓ Copiado' : '🔗 Enlace'}
      </button>

      {/* WhatsApp */}
      <button
        onClick={compartirWhatsApp}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-misterio tracking-wider
                   border border-dorado/30 text-dorado/60 hover:border-green-500/60 hover:text-green-400
                   transition-all duration-200"
        title="Compartir en WhatsApp"
      >
        💬 WhatsApp
      </button>

      {/* X (Twitter) */}
      <button
        onClick={compartirX}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-misterio tracking-wider
                   border border-dorado/30 text-dorado/60 hover:border-sky-500/60 hover:text-sky-400
                   transition-all duration-200"
        title="Compartir en X (Twitter)"
      >
        𝕏 Compartir
      </button>
    </div>
  )
}
