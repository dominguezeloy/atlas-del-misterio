import { useState } from 'react'

/**
 * Componente de valoración por estrellas.
 *
 * @param {Object}   props
 * @param {number}   props.valor         - Valor actual (0-5)
 * @param {number}   [props.max=5]       - Número máximo de estrellas
 * @param {boolean}  [props.interactivo] - Permite al usuario seleccionar
 * @param {string}   [props.tamano]      - 'sm' | 'md' | 'lg'
 * @param {Function} [props.onChange]    - (valor) => void — solo si interactivo
 */
export default function Estrellas({
  valor = 0,
  max = 5,
  interactivo = false,
  tamano = 'md',
  onChange,
}) {
  const [hover, setHover] = useState(0)

  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  const estrellasActivas = hover || valor

  return (
    <div
      className={`flex gap-0.5 ${interactivo ? 'cursor-pointer' : ''}`}
      role={interactivo ? 'group' : undefined}
      aria-label={`${valor} de ${max} estrellas`}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactivo}
          onClick={interactivo ? () => onChange?.(n) : undefined}
          onMouseEnter={interactivo ? () => setHover(n) : undefined}
          onMouseLeave={interactivo ? () => setHover(0) : undefined}
          className={`
            ${sizes[tamano] || sizes.md}
            leading-none transition-all duration-100
            ${interactivo ? 'hover:scale-110 active:scale-95' : ''}
            ${!interactivo ? 'cursor-default' : ''}
          `}
          aria-label={`${n} estrellas`}
          style={{ background: 'none', border: 'none', padding: '0' }}
        >
          {n <= estrellasActivas ? (
            <span style={{ color: '#c9a84c', textShadow: '0 0 6px rgba(201,168,76,0.6)' }}>★</span>
          ) : (
            <span style={{ color: '#c9a84c44' }}>☆</span>
          )}
        </button>
      ))}
    </div>
  )
}
