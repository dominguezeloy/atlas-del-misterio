import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { TILE_PROVIDERS, TILE_PROVIDER_ACTIVO } from './TILE_PROVIDERS'
import { getIconByCategoriaSlug } from './MarkerIcons'
import PopupSuceso from './PopupSuceso'

// Centro geográfico de España y zoom inicial
const ESPANA_CENTER = [40.4165, -3.7026]
const ESPANA_ZOOM   = 6

/**
 * Mapa interactivo principal del Atlas del Misterio.
 *
 * @param {Object}      props
 * @param {Array}       props.sucesos          - Lista de sucesos (ya filtrados por el padre)
 * @param {boolean}     [props.loading]        - Muestra indicador de carga
 * @param {string}      [props.proveedorTiles] - Key de TILE_PROVIDERS (por defecto: cartoDark)
 */
export default function MapaInteractivo({
  sucesos = [],
  loading = false,
  proveedorTiles = TILE_PROVIDER_ACTIVO,
}) {
  const tiles = TILE_PROVIDERS[proveedorTiles] || TILE_PROVIDERS.cartoDark

  // Memoizamos los marcadores para no recrearlos en cada render
  const marcadores = useMemo(() => sucesos.map((suceso) => (
    <Marker
      key={suceso.id}
      position={[parseFloat(suceso.latitud), parseFloat(suceso.longitud)]}
      icon={getIconByCategoriaSlug(suceso.categoria?.slug, suceso.categoria?.color)}
    >
      <Popup>
        <PopupSuceso suceso={suceso} />
      </Popup>
    </Marker>
  )), [sucesos])

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={ESPANA_CENTER}
        zoom={ESPANA_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl
        scrollWheelZoom
      >
        {/* Capa de tiles configurable */}
        <TileLayer
          url={tiles.url}
          attribution={tiles.attribution}
          maxZoom={tiles.maxZoom}
        />

        {/* Clustering de marcadores */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          animate
        >
          {marcadores}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Indicador de carga superpuesto */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-carbon/60 z-[2000] pointer-events-none">
          <div className="panel-oscuro px-6 py-4 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-dorado border-t-transparent rounded-full animate-spin" />
            <span className="font-misterio text-dorado text-sm tracking-wider">
              Cargando sucesos…
            </span>
          </div>
        </div>
      )}

      {/* Contador de sucesos visibles */}
      {!loading && sucesos.length > 0 && (
        <div className="absolute top-3 right-3 z-[1000] panel-oscuro px-3 py-1.5 text-xs font-misterio text-dorado/70 pointer-events-none">
          {sucesos.length} suceso{sucesos.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
