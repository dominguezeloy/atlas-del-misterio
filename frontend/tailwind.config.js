/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal del Atlas del Misterio
        carbon:    '#0a0a0f',   // Fondo más oscuro
        antracita: '#1c1c2e',   // Fondo de paneles y modales
        petroleo:  '#0d1b2a',   // Fondo intermedio
        dorado: {
          DEFAULT: '#c9a84c',   // Dorado envejecido principal
          claro:   '#e8c97a',   // Dorado para textos sobre oscuro
          oscuro:  '#8a6c1e',   // Dorado para bordes y sombras
          hover:   '#d4b55a',   // Dorado para hover
        },
        misterio: {
          50:  '#fdf8ee',
          100: '#f7e8c3',
          200: '#eece88',
          300: '#e5b54d',
          400: '#c9a84c',  // = dorado por defecto
          500: '#a88730',
          600: '#836920',
          700: '#5e4b17',
          800: '#3a2e0e',
          900: '#1c1606',
        },
      },
      fontFamily: {
        misterio: ['Cinzel', 'Georgia', 'serif'],
        cuerpo:   ['Crimson Text', 'Georgia', 'serif'],
        mono:     ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'dorado':    '0 0 20px rgba(201, 168, 76, 0.3)',
        'dorado-lg': '0 0 40px rgba(201, 168, 76, 0.4)',
        'misterio':  '0 4px 24px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradiente-misterio': 'linear-gradient(135deg, #0a0a0f 0%, #0d1b2a 50%, #1c1c2e 100%)',
        'gradiente-dorado':   'linear-gradient(90deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)',
      },
      animation: {
        'pulso-dorado': 'pulsoDorado 2s ease-in-out infinite',
        'aparecer':     'aparecer 0.3s ease-out',
        'deslizar-up':  'deslizarUp 0.3s ease-out',
      },
      keyframes: {
        pulsoDorado: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(201, 168, 76, 0.2)' },
          '50%':       { boxShadow: '0 0 25px rgba(201, 168, 76, 0.5)' },
        },
        aparecer: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        deslizarUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
