import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Incident } from '../../types';
import { 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Pause, 
  Play, 
  MapPin, 
  Radio, 
  Droplets, 
  TreePine, 
  Crosshair, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { formatRadius } from '../../utils/formatters';

interface TopEmergencySliderProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onLocateOnMap: (incident: Incident) => void;
  onOpenDetail?: (incident: Incident) => void;
}

const AUTO_SLIDE_INTERVAL_MS = 6000;

export const TopEmergencySlider: React.FC<TopEmergencySliderProps> = ({
  incidents,
  onSelectIncident,
  onLocateOnMap,
  onOpenDetail,
}) => {
  // Extract critical & high priority incidents
  const emergencyIncidents = incidents.filter(
    (inc) => inc.severity === 'critical' || inc.status === 'containment_active' || inc.severity === 'high'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = emergencyIncidents.length > 0 ? emergencyIncidents.length : 1;
  const currentIncident = emergencyIncidents[currentIndex] || null;

  // Next Slide
  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgressKey((prev) => prev + 1);
  }, [totalSlides]);

  // Prev Slide
  const handlePrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgressKey((prev) => prev + 1);
  }, [totalSlides]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || isHovered || totalSlides <= 1 || isCollapsed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isHovered, totalSlides, isCollapsed, handleNext]);

  // Keyboard controls when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === ' ') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  // If no emergency incidents, display a peaceful monitoring bulletin
  if (emergencyIncidents.length === 0) {
    return (
      <div className="bg-slate-900/90 border-b border-emerald-500/20 backdrop-blur-md px-4 py-2 text-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-emerald-300">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold uppercase tracking-wider text-emerald-200">Red de Monitoreo Comunitario Activa:</span>
            <span className="text-slate-300 hidden sm:inline">Todos los sectores bajo vigilancia preventiva y tiempo real. Sin contingencias críticas no contenidas.</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Sistema en línea</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Slider de alertas de emergencias ambientales activas"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-30 bg-gradient-to-r from-red-950/95 via-slate-900/95 to-slate-950 border-b border-red-500/40 backdrop-blur-xl shadow-lg shadow-red-950/20 text-slate-100 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-red-400/50"
    >
      {/* Top progress bar for auto-play */}
      {!isPaused && !isHovered && !isCollapsed && totalSlides > 1 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-950/60 overflow-hidden">
          <div
            key={progressKey}
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-red-500 animate-[progressBar_6s_linear_infinite]"
            style={{ animationDuration: `${AUTO_SLIDE_INTERVAL_MS}ms` }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left badge & status beacon */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm shadow-red-400"></span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span className="hidden xs:inline">Alerta</span> Crítica
              </span>
              <span className="font-mono text-[11px] font-bold text-red-300 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/60 hidden sm:inline">
                {currentIncident.folioNumber}
              </span>
            </div>

            {/* Slide Index Badge */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-red-300/80 bg-slate-900/80 px-2 py-0.5 rounded-md border border-red-900/50">
              <span className="text-white font-bold">{currentIndex + 1}</span>
              <span>/</span>
              <span>{totalSlides}</span>
            </div>
          </div>

          {/* Center: Slide Incident Details with smooth animation */}
          <div className="flex-1 min-w-0 px-1 sm:px-2">
            <div
              key={currentIncident.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 ${
                direction === 'next' ? 'animate-slideDown' : 'animate-slideUp'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs sm:text-sm font-bold text-white truncate hover:text-red-200 transition-colors">
                  {currentIncident.title}
                </span>
              </div>

              {/* Badges metadata */}
              <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {currentIncident.location.municipality || 'Barrancabermeja'}
                  </span>
                </span>

                <span className="text-slate-600 hidden xs:inline">•</span>

                <span className="font-mono text-red-300 font-bold hidden xs:inline">
                  {formatRadius(currentIncident.affectedRadiusMeters)}
                </span>

                {currentIncident.environmentalImpact?.waterSourcesAffected && (
                  <span className="hidden lg:flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>Fuente de agua</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions & Slide Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Action: Locate on Map */}
            <button
              onClick={() => onLocateOnMap(currentIncident)}
              title="Centrar y visualizar incidente en el mapa"
              className="px-2.5 sm:px-3 py-1 bg-red-600/90 hover:bg-red-500 active:scale-95 text-white text-[11px] font-bold rounded-lg transition-all duration-200 shadow-md shadow-red-950/60 flex items-center gap-1.5 border border-red-400/40"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Localizar</span>
            </button>

            {/* Quick Action: Open Modal Details */}
            {onOpenDetail && (
              <button
                onClick={() => onOpenDetail(currentIncident)}
                title="Abrir expediente completo del incidente"
                className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-[11px] font-semibold rounded-lg transition-colors border border-slate-700/70"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Expediente</span>
              </button>
            )}

            {/* Slider Navigation Controls */}
            {totalSlides > 1 && (
              <div className="flex items-center gap-1 bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={handlePrev}
                  aria-label="Alerta anterior"
                  title="Alerta anterior (←)"
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors active:scale-90"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsPaused((p) => !p)}
                  aria-label={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
                  title={isPaused ? 'Reanudar carrusel (Espacio)' : 'Pausar carrusel (Espacio)'}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  {isPaused ? (
                    <Play className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Pause className="w-3 h-3 text-amber-400" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Siguiente alerta"
                  title="Siguiente alerta (→)"
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors active:scale-90"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Pagination dots */}
            {totalSlides > 1 && (
              <div className="hidden xl:flex items-center gap-1 pl-1">
                {emergencyIncidents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 'next' : 'prev');
                      setCurrentIndex(i);
                      setProgressKey((prev) => prev + 1);
                    }}
                    aria-label={`Ir a alerta ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIndex 
                        ? 'w-4 bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]' 
                        : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </aside>
  );
};

