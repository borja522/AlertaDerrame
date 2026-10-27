import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident, IncidentCategory, IncidentSeverity } from '../../types';
import { CATEGORY_METADATA } from '../../data/authorities';
import { Crosshair, Layers, Locate, ShieldAlert, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

interface IncidentMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  isPickingLocation?: boolean;
  pickedLocation?: { lat: number; lng: number } | null;
  onLocationPicked?: (lat: number, lng: number) => void;
  filterCategory?: IncidentCategory | 'all';
  filterSeverity?: IncidentSeverity | 'all';
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  isPickingLocation = false,
  pickedLocation,
  onLocationPicked,
  filterCategory = 'all',
  filterSeverity = 'all'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusLayerRef = useRef<L.LayerGroup | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'carto' | 'satellite' | 'osm'>('carto');
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Tile layers definition
  const tileURLs = {
    carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const tileAttributions = {
    carto: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    osm: '&copy; OpenStreetMap contributors'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center near Barrancabermeja / Magdalena Medio (critical zone for oil and ecology)
    const initialLat = 6.9832;
    const initialLng = -73.8562;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    const tile = L.tileLayer(tileURLs[mapStyle], {
      attribution: tileAttributions[mapStyle],
      maxZoom: 19
    }).addTo(map);

    baseTileLayerRef.current = tile;
    markersLayerRef.current = L.layerGroup().addTo(map);
    radiusLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Map click for picking location
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onLocationPicked) {
        onLocationPicked(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;
    baseTileLayerRef.current.setUrl(tileURLs[mapStyle]);
  }, [mapStyle]);

  // Handle Picked Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (pickMarkerRef.current) {
      mapInstanceRef.current.removeLayer(pickMarkerRef.current);
      pickMarkerRef.current = null;
    }

    if (pickedLocation) {
      const pinIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl ring-4 ring-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([pickedLocation.lat, pickedLocation.lng], {
        icon: pinIcon,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);

      pickMarkerRef.current = marker;
      mapInstanceRef.current.panTo([pickedLocation.lat, pickedLocation.lng], { animate: true });
    }
  }, [pickedLocation]);

  // Render Incidents Markers and Radii
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !radiusLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    radiusLayerRef.current.clearLayers();

    const filtered = incidents.filter(inc => {
      const matchCat = filterCategory === 'all' || inc.category === filterCategory;
      const matchSev = filterSeverity === 'all' || inc.severity === filterSeverity;
      return matchCat && matchSev;
    });

    filtered.forEach(inc => {
      const meta = CATEGORY_METADATA[inc.category];
      const isCritical = inc.severity === 'critical';
      const isHigh = inc.severity === 'high';
      const isSelected = selectedIncident?.id === inc.id;

      // Color mapping
      const markerColor = meta.color;
      const pulseClass = isCritical ? 'pulse-critical' : isHigh ? 'pulse-warning' : '';

      // Create Custom SVG Marker Icon
      const customIcon = L.divIcon({
        className: 'incident-marker-wrap',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 ${isSelected ? 'scale-125 z-50' : ''}">
            <div class="${pulseClass} rounded-full" style="padding: 2px;">
              <div class="flex items-center justify-center w-9 h-9 rounded-full shadow-2xl border-2 text-white" 
                   style="background: ${markerColor}; border-color: ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)'}; box-shadow: 0 8px 16px -2px rgba(0,0,0,0.6);">
                <span class="text-xs font-black">${inc.category === 'oil_spill' ? '🛢️' : inc.category === 'deforestation' ? '🌲' : inc.category === 'water_pollution' ? '💧' : '⚠️'}</span>
              </div>
            </div>
            ${isCritical ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span></span>' : ''}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([inc.location.lat, inc.location.lng], {
        icon: customIcon
      });

      // HTML Popup with modern Tailwind design
      const popupHtml = `
        <div class="w-72 p-1 text-slate-100">
          <div class="relative overflow-hidden rounded-lg mb-2.5">
            <img src="${inc.photos[0] || 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80'}" 
                 alt="${inc.title}" 
                 class="w-full h-28 object-cover rounded-lg brightness-90 contrast-105" />
            <div class="absolute top-2 left-2 flex gap-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${meta.badgeBg}">
                ${meta.shortLabel}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                inc.severity === 'critical' ? 'bg-red-500/80 text-white' :
                inc.severity === 'high' ? 'bg-amber-500/80 text-white' : 'bg-blue-500/80 text-white'
              }">
                ${inc.severity}
              </span>
            </div>
            <div class="absolute bottom-1 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300">
              ${inc.folioNumber}
            </div>
          </div>

          <h4 class="text-sm font-bold text-white line-clamp-2 mb-1 leading-snug">
            ${inc.title}
          </h4>

          <div class="text-xs text-slate-300 mb-2 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="truncate">${inc.location.municipality || 'Municipio'}, ${inc.location.department || ''}</span>
          </div>

          <div class="grid grid-cols-2 gap-1.5 mb-3 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[11px]">
            <div>
              <span class="text-slate-400 block text-[9px] uppercase">Radio impacto</span>
              <span class="font-semibold text-emerald-400 font-mono">${(inc.affectedRadiusMeters / 1000).toFixed(1)} km</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] uppercase">Autoridad</span>
              <span class="font-semibold text-sky-300 truncate block">${inc.authorityAssigned.agencyName.split('/')[0]}</span>
            </div>
          </div>

          <button id="view-incident-btn-${inc.id}" 
                  class="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5">
            <span>Ver Expediente y Acciones</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('click', () => {
        onSelectIncident(inc);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-incident-btn-${inc.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectIncident(inc);
          };
        }
      });

      markersLayerRef.current?.addLayer(marker);

      // Add affected radius circle if enabled
      if (showRadius && inc.affectedRadiusMeters > 0) {
        const circle = L.circle([inc.location.lat, inc.location.lng], {
          radius: inc.affectedRadiusMeters,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: isCritical ? 0.18 : 0.1,
          weight: isCritical ? 2 : 1.2,
          dashArray: isCritical ? undefined : '5, 5'
        });
        radiusLayerRef.current?.addLayer(circle);
      }
    });

    // If there is a selected incident, center on it
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedIncident.location.lat, selectedIncident.location.lng],
        14,
        { duration: 1.2 }
      );
    }
  }, [incidents, filterCategory, filterSeverity, selectedIncident, showRadius]);

  // Geolocation trigger
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });

          // Add user indicator
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-sky-500 ring-2 ring-white"></span>
              </div>
            `,
            iconSize: [20, 20]
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<div class="text-xs font-bold text-slate-800 p-1">📍 Tu ubicación actual<br><span class="text-[10px] text-slate-500">Precisión: ±${Math.round(accuracy)}m</span></div>`)
            .openPopup();
        }

        if (onLocationPicked && isPickingLocation) {
          onLocationPicked(latitude, longitude);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('No pudimos acceder a tu ubicación GPS. Puedes hacer clic directamente en el mapa para marcar el punto.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] z-0" />

      {/* Picking Location Indicator Overlay */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="glass-panel px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-semibold text-emerald-400 border border-emerald-500/40 shadow-xl animate-pulse">
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span>Haz clic en el mapa para fijar el epicentro del incidente</span>
          </div>
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Style Switcher */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shadow-lg border border-slate-700/60">
          <button
            title="Vista Urbana / Voyager"
            onClick={() => setMapStyle('carto')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mapStyle === 'carto'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Claro</span>
          </button>
          <button
            title="Vista Satelital Satelital de Alta Resolución"
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mapStyle === 'satellite'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Satélite</span>
          </button>
          <button
            title="Vista Estándar OpenStreetMap"
            onClick={() => setMapStyle('osm')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mapStyle === 'osm'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span className="text-[11px] font-mono">OSM</span>
          </button>
        </div>

        {/* Toggle Affected Radius */}
        <button
          onClick={() => setShowRadius(!showRadius)}
          title="Alternar radio de afectación"
          className={`glass-panel px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-2 shadow-lg border border-slate-700/60 transition-all ${
            showRadius ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 bg-emerald-500/20" />
            <span className="text-[11px]">Radio de Afectación</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-slate-800/80 px-1.5 py-0.5 rounded">
            {showRadius ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Bottom Floating Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          title="Centrar en mi ubicación actual GPS"
          className="glass-panel p-2.5 rounded-xl text-slate-200 hover:text-emerald-400 hover:border-emerald-500/50 shadow-xl transition-all flex items-center justify-center active:scale-95"
        >
          <Locate className={`w-5 h-5 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        <div className="glass-panel flex flex-col rounded-xl overflow-hidden shadow-xl border border-slate-700/60">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Acercar mapa"
            className="p-2.5 text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors border-b border-slate-800"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Alejar mapa"
            className="p-2.5 text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:block">
        <div className="glass-panel p-3 rounded-xl border border-slate-800/80 shadow-2xl max-w-xs">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simbología de Incidentes</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
              <span>Derrame Hidrocarburos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              <span>Tala / Deforestación</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm" />
              <span>Contaminación Hídrica</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
              <span>Residuos Peligrosos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
