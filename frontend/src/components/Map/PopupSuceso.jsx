import { useNavigate } from 'react-router-dom'
import Estrellas from '../UI/Estrellas'

/**
 * Contenido del popup de Leaflet al hacer click en un marcador.
 * Se renderiza dentro del contenedor de Leaflet (con estilos propios).
 *
 * @param {Object} props.suceso - Suceso en formato SucesoListSerializer
 */
export default function PopupSuceso({ suceso }) {
  const navigate = useNavigate()

  const tieneImagen = !!suceso.imagen_principal_url

  return (
    <div style={{ minWidth: '240px', maxWidth: '280px', fontFamily: "'Crimson Text', Georgia, serif" }}>
      {/* Imagen de portada */}
      {tieneImagen && (
        <div style={{ height: '130px', overflow: 'hidden' }}>
          <img
            src={suceso.imagen_principal_url}
            alt={suceso.titulo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      <div style={{ padding: '12px 14px' }}>
        {/* Badge de categoría */}
        <div style={{ marginBottom: '6px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: (suceso.categoria?.color || '#c9a84c') + '22',
              border: `1px solid ${suceso.categoria?.color || '#c9a84c'}66`,
              color: suceso.categoria?.color || '#c9a84c',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '11px',
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.05em',
            }}
          >
            <span>{suceso.categoria?.icono_emoji}</span>
            <span>{suceso.categoria?.nombre}</span>
          </span>
        </div>

        {/* Título */}
        <h3
          style={{
            margin: '4px 0 6px',
            fontSize: '15px',
            fontFamily: "'Cinzel', Georgia, serif",
            color: '#e8c97a',
            lineHeight: 1.3,
          }}
        >
          {suceso.titulo}
        </h3>

        {/* Localidad */}
        {suceso.localidad && (
          <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#c9a84c88' }}>
            📍 {suceso.localidad}{suceso.provincia ? `, ${suceso.provincia}` : ''}
          </p>
        )}

        {/* Descripción corta */}
        <p
          style={{
            margin: '0 0 10px',
            fontSize: '13px',
            color: '#e8d5a3cc',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {suceso.descripcion_corta}
        </p>

        {/* Valoración */}
        {suceso.total_votos > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Estrellas valor={Math.round(suceso.valoracion_media)} tamano="sm" />
            <span style={{ fontSize: '11px', color: '#c9a84c88' }}>
              {suceso.valoracion_media} ({suceso.total_votos} votos)
            </span>
          </div>
        )}

        {/* Nivel misterio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', color: '#c9a84c66', fontFamily: "'Cinzel', serif" }}>
            MISTERIO:
          </span>
          <div>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                style={{ color: i < suceso.nivel_misterio ? '#c9a84c' : '#c9a84c33', fontSize: '12px' }}
              >
                ◆
              </span>
            ))}
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={() => navigate(`/suceso/${suceso.slug}`)}
          style={{
            width: '100%',
            padding: '8px',
            background: 'transparent',
            border: '1px solid #c9a84c88',
            borderRadius: '8px',
            color: '#c9a84c',
            fontSize: '12px',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#c9a84c22'
            e.target.style.borderColor = '#c9a84c'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.borderColor = '#c9a84c88'
          }}
        >
          VER FICHA COMPLETA →
        </button>
      </div>
    </div>
  )
}
