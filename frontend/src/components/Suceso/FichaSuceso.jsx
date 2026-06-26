import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { TILE_PROVIDERS } from '../Map/TILE_PROVIDERS'
import { getIconByCategoriaSlug } from '../Map/MarkerIcons'
import GaleriaImagenes from './GaleriaImagenes'
import FuentesList from './FuentesList'
import SistemaVotos from './SistemaVotos'
import BotonesCompartir from './BotonesCompartir'
import BtnFavorito from './BtnFavorito'
import Estrellas from '../UI/Estrellas'

/**
 * Ficha completa de un suceso paranormal.
 * Incluye: descripción, galería, audio, vídeo, mapa mini, fuentes y votos.
 *
 * @param {Object} props.suceso - Suceso en formato SucesoDetailSerializer
 */
export default function FichaSuceso({ suceso }) {
  if (!suceso) return null

  const lat  = parseFloat(suceso.latitud)
  const lng  = parseFloat(suceso.longitud)
  const tiles = TILE_PROVIDERS.cartoDark

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Cabecera ─────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Badge de categoría */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-misterio tracking-wider border"
            style={{
              background: (suceso.categoria?.color || '#c9a84c') + '22',
              borderColor: (suceso.categoria?.color || '#c9a84c') + '66',
              color: suceso.categoria?.color || '#c9a84c',
            }}
          >
            <span>{suceso.categoria?.icono_emoji}</span>
            <span>{suceso.categoria?.nombre}</span>
          </span>
        </div>

        {/* Título */}
        <h1 className="font-misterio text-3xl sm:text-4xl text-dorado-claro leading-tight mb-3">
          {suceso.titulo}
        </h1>

        {/* Meta: ubicación + fecha */}
        <div className="flex flex-wrap gap-4 text-dorado/60 text-sm font-cuerpo mb-4">
          {suceso.localidad && (
            <span>
              📍 {suceso.localidad}
              {suceso.provincia ? `, ${suceso.provincia}` : ''}
              {suceso.comunidad_autonoma ? ` — ${suceso.comunidad_autonoma}` : ''}
            </span>
          )}
          {suceso.fecha_suceso && (
            <span>
              🗓️ {new Date(suceso.fecha_suceso).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Nivel de misterio y valoración */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-misterio text-dorado/50 tracking-widest">MISTERIO</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className="text-base"
                  style={{ color: i < suceso.nivel_misterio ? '#c9a84c' : '#c9a84c33' }}
                >
                  ◆
                </span>
              ))}
            </div>
          </div>

          {suceso.total_votos > 0 && (
            <div className="flex items-center gap-2">
              <Estrellas valor={Math.round(suceso.valoracion_media)} tamano="sm" />
              <span className="text-xs text-dorado/50 font-cuerpo">
                {suceso.valoracion_media} / 5 ({suceso.total_votos} votos)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Imagen principal ─────────────────────────────────────── */}
      {suceso.imagen_principal_url && (
        <div className="rounded-xl overflow-hidden mb-8 border border-dorado/20 shadow-misterio">
          <img
            src={suceso.imagen_principal_url}
            alt={suceso.titulo}
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* ── Descripción corta (intro) ────────────────────────────── */}
      <div className="panel-oscuro p-6 mb-6">
        <p className="font-cuerpo text-xl text-dorado-claro/90 italic leading-relaxed">
          {suceso.descripcion_corta}
        </p>
      </div>

      {/* ── Acciones: Favorito + Compartir ──────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8 py-4 border-y border-dorado/10">
        <BtnFavorito sucesoId={suceso.id} />
        <BotonesCompartir titulo={suceso.titulo} slug={suceso.slug} />
      </div>

      {/* ── Descripción larga ────────────────────────────────────── */}
      <section className="mb-10">
        <div
          className="font-cuerpo text-lg text-dorado-claro/80 leading-relaxed space-y-4"
          style={{ whiteSpace: 'pre-line' }}
        >
          {suceso.descripcion_larga}
        </div>
      </section>

      {/* ── Galería de imágenes ──────────────────────────────────── */}
      {suceso.imagenes && suceso.imagenes.length > 0 && (
        <section className="mb-10">
          <h2 className="titulo-misterio text-lg mb-4">Galería</h2>
          <GaleriaImagenes imagenes={suceso.imagenes} />
        </section>
      )}

      {/* ── Audio de psicofonía ──────────────────────────────────── */}
      {suceso.audio_url && (
        <section className="mb-10">
          <h2 className="titulo-misterio text-lg mb-4">🎙️ Grabación de audio</h2>
          <div className="panel-oscuro p-4">
            <audio
              controls
              src={suceso.audio_url}
              className="w-full"
              style={{ filter: 'invert(1) hue-rotate(180deg)' }}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </section>
      )}

      {/* ── Vídeo ────────────────────────────────────────────────── */}
      {suceso.video_url && (
        <section className="mb-10">
          <h2 className="titulo-misterio text-lg mb-4">🎬 Vídeo</h2>
          <div className="panel-oscuro overflow-hidden rounded-xl">
            <div className="relative aspect-video">
              <iframe
                src={getVideoEmbedUrl(suceso.video_url)}
                title={`Vídeo: ${suceso.titulo}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Mapa de ubicación ────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="titulo-misterio text-lg mb-4">📍 Ubicación</h2>
        <div className="rounded-xl overflow-hidden border border-dorado/20 shadow-misterio" style={{ height: '220px' }}>
          <MapContainer
            center={[lat, lng]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
          >
            <TileLayer
              url={tiles.url}
              attribution={tiles.attribution}
              maxZoom={tiles.maxZoom}
            />
            <Marker
              position={[lat, lng]}
              icon={getIconByCategoriaSlug(suceso.categoria?.slug, suceso.categoria?.color)}
            />
          </MapContainer>
        </div>
        {suceso.localidad && (
          <p className="text-center text-dorado/50 text-sm font-cuerpo mt-2">
            {suceso.localidad}{suceso.provincia ? `, ${suceso.provincia}` : ''}
          </p>
        )}
      </section>

      {/* ── Fuentes ──────────────────────────────────────────────── */}
      {suceso.fuentes && suceso.fuentes.length > 0 && (
        <section className="mb-10">
          <h2 className="titulo-misterio text-lg mb-4">📚 Fuentes</h2>
          <FuentesList fuentes={suceso.fuentes} />
        </section>
      )}

      {/* ── Sistema de votos ─────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="titulo-misterio text-lg mb-4">⭐ Valoración</h2>
        <SistemaVotos suceso={suceso} />
      </section>

    </article>
  )
}

/**
 * Convierte una URL de vídeo a su URL de embed.
 * Soporta YouTube y Vimeo.
 */
function getVideoEmbedUrl(url) {
  if (!url) return ''

  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  return url
}
