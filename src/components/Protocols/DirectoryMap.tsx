import React, { useEffect, useRef, useState, useId } from 'react';
import L from 'leaflet';
import { EnvironmentalAuthority, AuthorityCategory } from '../../types';
import { 
  MapPin, 
  Navigation, 
  PhoneCall, 
  ZoomIn, 
  ZoomOut, 
  ExternalLink 
} from 'lucide-react';

interface DirectoryMapProps {
  authorities: EnvironmentalAuthority[];
  selectedAuthority: EnvironmentalAuthority | null;
  onSelectAuthority: (authority: EnvironmentalAuthority | null) => void;
  selectedCategory: AuthorityCategory | 'all';
}

const CATEGORY_COLORS: Record<AuthorityCategory, { bg: string; border: string; text: string; hex: string; emoji: string }> = {
  emergency: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', hex: '#ef4444', emoji: '🚒' },
  police: { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400', hex: '#6366f1', emoji: '👮' },
  environmental: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', hex: '#10b981', emoji: '🌿' },
  maritime: { bg: 'bg-sky-500/20', border: 'border-sky-500', text: 'text-sky-400', hex: '#0284c7', emoji: '⚓' },
  health: { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400', hex: '#f43f5e', emoji: '🏥' },
};

export const DirectoryMap: React.FC<DirectoryMapProps> = ({
  authorities,
  selectedAuthority,
  onSelectAuthority,
  selectedCategory
}) => {
  const mapElementId = useId().replace(/:/g, '');
  const containerId = `directory-map-${mapElementId}`;
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'carto' | 'satellite' | 'osm'>('carto');

  const tileURLs = {
    carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const tileAttributions = {
    carto: '&copy; CARTO &copy; OpenStreetMap',
    satellite: 'Tiles &copy; Esri World Imagery',
    osm: '&copy; OpenStreetMap contributors'
  };

  // Initialize Map strictly on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Centered around Colombia / Magdalena Medio
    const map = L.map(mapContainerRef.current, {
      center: [6.4, -73.8],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    const tileLayer = L.tileLayer(tileURLs[mapStyle], {
      attribution: tileAttributions[mapStyle],
      maxZoom: 18
    }).addTo(map);

    baseTileLayerRef.current = tileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle tile switch
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;
    baseTileLayerRef.current.setUrl(tileURLs[mapStyle]);
  }, [mapStyle]);

  // Update Authority Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = selectedCategory === 'all' 
      ? authorities 
      : authorities.filter(a => a.category === selectedCategory);

    filtered.forEach((auth) => {
      const config = CATEGORY_COLORS[auth.category] || CATEGORY_COLORS.environmental;
      const isSelected = selectedAuthority?.id === auth.id;

      // Custom HTML Marker Pin
      const iconHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '44px' : '36px'};
          height: ${isSelected ? '44px' : '36px'};
          border-radius: 9999px;
          background: ${config.hex};
          color: white;
          box-shadow: 0 4px 14px rgba(0,0,0,0.45);
          border: 3px solid ${isSelected ? '#ffffff' : '#0f172a'};
          transition: all 0.3s ease;
          font-size: ${isSelected ? '20px' : '16px'};
          cursor: pointer;
        ">
          <span>${config.emoji}</span>
          ${isSelected ? `
            <div style="
              position: absolute;
              bottom: -6px;
              width: 10px;
              height: 10px;
              background: #ffffff;
              transform: rotate(45deg);
            "></div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-authority-pin',
        html: iconHtml,
        iconSize: isSelected ? [44, 44] : [36, 36],
        iconAnchor: isSelected ? [22, 44] : [18, 36],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([auth.coordinates.lat, auth.coordinates.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectAuthority(auth);
      });

      // Quick hover tooltip
      marker.bindTooltip(`
        <div style="font-family: inherit; font-size: 11px; padding: 2px 4px; font-weight: bold;">
          ${auth.acronym} - ${auth.city || ''}
        </div>
      `, { direction: 'top', offset: [0, -32] });

      marker.addTo(markersLayerRef.current!);
    });
  }, [authorities, selectedAuthority, selectedCategory, onSelectAuthority]);

  // Center on selected authority if changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedAuthority) return;

    mapInstanceRef.current.flyTo(
      [selectedAuthority.coordinates.lat, selectedAuthority.coordinates.lng],
      13,
      { duration: 1.2 }
    );
  }, [selectedAuthority]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([6.4, -73.8], 7, { duration: 1 });
      onSelectAuthority(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map DOM Element */}
      <div id={containerId} ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Layer Selector Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 glass-panel p-1.5 rounded-xl border border-slate-800/80 shadow-lg">
        <button
          onClick={() => setMapStyle('carto')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapStyle === 'carto' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Carto Voyager
        </button>
        <button
          onClick={() => setMapStyle('satellite')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapStyle === 'satellite' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Satélite HD
        </button>
        <button
          onClick={() => setMapStyle('osm')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapStyle === 'osm' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Callejero OSM
        </button>
      </div>

      {/* Zoom and Reset Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          title="Acercar mapa"
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 shadow-lg transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Alejar mapa"
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 shadow-lg transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          title="Centrar mapa nacional"
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 shadow-lg transition-all"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Selected Authority Quick Info Overlay Card (Bottom Center) */}
      {selectedAuthority && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-10 glass-panel p-4 rounded-2xl border border-slate-700 shadow-2xl animate-fadeIn backdrop-blur-xl bg-slate-950/90">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${CATEGORY_COLORS[selectedAuthority.category].bg} border ${CATEGORY_COLORS[selectedAuthority.category].border}`}>
                {CATEGORY_COLORS[selectedAuthority.category].emoji}
              </div>
              <div>
                <span className={`text-[10px] uppercase font-mono font-bold ${CATEGORY_COLORS[selectedAuthority.category].text}`}>
                  {selectedAuthority.type.toUpperCase()} • {selectedAuthority.acronym}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {selectedAuthority.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedAuthority.address || 'Sede Operativa'}, {selectedAuthority.city}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onSelectAuthority(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {selectedAuthority.coverageDescription}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-400">Emergencia:</span>
              <span className="font-mono font-bold text-emerald-400">{selectedAuthority.emergencyHotline}</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedAuthority.website && (
                <a
                  href={selectedAuthority.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs flex items-center gap-1"
                  title="Visitar sitio web oficial"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="text-[10px]">Portal</span>
                </a>
              )}
              <a
                href={`tel:${selectedAuthority.emergencyHotline.split('/')[0].replace(/[^\d+]/g, '')}`}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Llamar Ahora</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Legend Map Helper (Bottom Right) */}
      <div className="hidden md:flex absolute bottom-4 right-4 z-10 glass-panel p-2.5 rounded-xl border border-slate-800/90 items-center gap-3 text-[10px] text-slate-400">
        <span className="font-bold text-slate-300">Simbología:</span>
        <span className="flex items-center gap-1">🚒 Bomberos</span>
        <span className="flex items-center gap-1">👮 Policía</span>
        <span className="flex items-center gap-1">🌿 Ambiental</span>
        <span className="flex items-center gap-1">⚓ DIMAR</span>
        <span className="flex items-center gap-1">🏥 Salud</span>
      </div>
    </div>
  );
};
