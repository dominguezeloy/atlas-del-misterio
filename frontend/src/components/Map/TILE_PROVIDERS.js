/**
 * Proveedores de tiles (capas de mapa) para el Atlas del Misterio.
 *
 * Para cambiar el proveedor, modifica TILE_PROVIDER_ACTIVO o
 * pasa la key como prop a MapaInteractivo.
 *
 * Proveedores disponibles:
 *  - cartoDark      → Carto Dark Matter (tema oscuro por defecto)
 *  - cartoVoyager   → Carto Voyager (más claro, para debug)
 *  - osm            → OpenStreetMap estándar
 *  - esriSatellite  → Esri Satélite (para overlay)
 *
 * FUTURE: Para tiles premium (Mapbox, MapTiler) añade la API key
 * como variable de entorno: VITE_MAP_API_KEY=...
 * y construye la URL aquí.
 */

export const TILE_PROVIDERS = {
  cartoDark: {
    name: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  cartoVoyager: {
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  // FUTURE: Mapbox (requiere VITE_MAPBOX_TOKEN en .env)
  // mapboxDark: {
  //   name: 'Mapbox Dark',
  //   url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
  //   attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
  //   maxZoom: 22,
  // },
}

// Proveedor activo por defecto
export const TILE_PROVIDER_ACTIVO = 'cartoDark'
