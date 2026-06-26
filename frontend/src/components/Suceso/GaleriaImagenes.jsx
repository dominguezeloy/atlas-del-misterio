import { useState } from 'react'

/**
 * Galería de imágenes de un suceso con lightbox CSS nativo.
 * Sin dependencias adicionales.
 *
 * @param {Array} props.imagenes - Array de { id, imagen_url, descripcion, orden }
 */
export default function GaleriaImagenes({ imagenes }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)

  if (!imagenes || imagenes.length === 0) return null

  const abrirLightbox = (idx) => setLightboxIdx(idx)
  const cerrarLightbox = () => setLightboxIdx(null)
  const anterior = () => setLightboxIdx((i) => Math.max(0, i - 1))
  const siguiente = () => setLightboxIdx((i) => Math.min(imagenes.length - 1, i + 1))

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft')  anterior()
    if (e.key === 'ArrowRight') siguiente()
    if (e.key === 'Escape')     cerrarLightbox()
  }

  return (
    <>
      {/* Grid de miniaturas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {imagenes.map((img, idx) => (
          <div
            key={img.id}
            className="relative aspect-video overflow-hidden rounded-lg cursor-pointer
                       border border-dorado/20 hover:border-dorado/60 transition-all duration-200
                       group shadow-misterio"
            onClick={() => abrirLightbox(idx)}
          >
            <img
              src={img.imagen_url}
              alt={img.descripcion || `Imagen ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {img.descripcion && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent
                              text-xs text-dorado/80 font-cuerpo opacity-0 group-hover:opacity-100 transition-opacity">
                {img.descripcion}
              </div>
            )}
            {/* Overlay de hover */}
            <div className="absolute inset-0 bg-dorado/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/92 backdrop-blur-sm animate-aparecer"
          onClick={cerrarLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes"
        >
          <div
            className="relative max-w-5xl max-h-[90vh] mx-4 animate-deslizar-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagenes[lightboxIdx].imagen_url}
              alt={imagenes[lightboxIdx].descripcion || `Imagen ${lightboxIdx + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg border border-dorado/30 shadow-dorado-lg"
            />

            {/* Pie de foto */}
            {imagenes[lightboxIdx].descripcion && (
              <p className="text-center text-dorado/70 text-sm font-cuerpo mt-3 italic">
                {imagenes[lightboxIdx].descripcion}
              </p>
            )}

            {/* Contador */}
            <p className="text-center text-dorado/40 text-xs font-misterio mt-1 tracking-widest">
              {lightboxIdx + 1} / {imagenes.length}
            </p>
          </div>

          {/* Botón cerrar */}
          <button
            className="absolute top-4 right-4 text-dorado/60 hover:text-dorado text-3xl leading-none z-10 transition-colors"
            onClick={cerrarLightbox}
            aria-label="Cerrar galería"
          >
            ✕
          </button>

          {/* Navegación anterior */}
          {lightboxIdx > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-dorado/60 hover:text-dorado
                         text-5xl leading-none z-10 transition-colors px-2"
              onClick={(e) => { e.stopPropagation(); anterior() }}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
          )}

          {/* Navegación siguiente */}
          {lightboxIdx < imagenes.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dorado/60 hover:text-dorado
                         text-5xl leading-none z-10 transition-colors px-2"
              onClick={(e) => { e.stopPropagation(); siguiente() }}
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
