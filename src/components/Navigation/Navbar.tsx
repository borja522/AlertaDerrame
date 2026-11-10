import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Map, 
  PhoneCall, 
  PlusCircle, 
  Radio, 
  ShieldCheck, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

export type NavView = 'map' | 'dashboard' | 'protocols';

interface NavbarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  onOpenReportModal: () => void;
  activeCriticalCount: number;
  isSoundMuted?: boolean;
  onToggleSound?: () => void;
}

interface TabItem {
  id: NavView;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
  badgeCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenReportModal,
  activeCriticalCount,
  isSoundMuted = false,
  onToggleSound,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'map',
      label: 'Mapa & Monitoreo',
      shortLabel: 'Mapa',
      icon: Map,
    },
    {
      id: 'dashboard',
      label: 'Gestión Autoridades',
      shortLabel: 'Autoridades',
      icon: ShieldCheck,
      badgeCount: activeCriticalCount,
    },
    {
      id: 'protocols',
      label: 'Protocolos & Directorio',
      shortLabel: 'Protocolos',
      icon: BookOpen,
    },
  ];

  // Desktop slider state
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const desktopTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Desktop hover preview pill state
  const [hoverStyle, setHoverStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Mobile slider state
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [mobileSliderStyle, setMobileSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Update desktop sliding pill position
  const updateDesktopSlider = useCallback(() => {
    const activeEl = desktopTabRefs.current[currentView];
    const navEl = desktopNavRef.current;
    if (activeEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setSliderStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
        opacity: 1,
      });
    }
  }, [currentView]);

  // Update mobile sliding pill position
  const updateMobileSlider = useCallback(() => {
    const activeEl = mobileTabRefs.current[currentView];
    const navEl = mobileNavRef.current;
    if (activeEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setMobileSliderStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
        opacity: 1,
      });
    }
  }, [currentView]);

  useEffect(() => {
    updateDesktopSlider();
    updateMobileSlider();

    const handleResize = () => {
      updateDesktopSlider();
      updateMobileSlider();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDesktopSlider, updateMobileSlider]);

  // Keyboard navigation across tabs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = tabs[(index + 1) % tabs.length];
      onViewChange(nextTab.id);
      desktopTabRefs.current[nextTab.id]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = tabs[(index - 1 + tabs.length) % tabs.length];
      onViewChange(prevTab.id);
      desktopTabRefs.current[prevTab.id]?.focus();
    }
  };

  const handleTabHover = (tabId: NavView) => {
    if (tabId === currentView) {
      setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const tabEl = desktopTabRefs.current[tabId];
    const navEl = desktopNavRef.current;
    if (tabEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const tabRect = tabEl.getBoundingClientRect();
      setHoverStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
        opacity: 1,
      });
    }
  };

  const handleNavMouseLeave = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-8 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onViewChange('map')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 blur-sm group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"></span>
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl group-hover:border-emerald-400 transition-colors">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-beacon" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans">
                Eco<span className="text-emerald-400">Alerta</span>
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Red Comunitaria
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
              Georreferenciación & Alerta Temprana de Incidentes Ambientales
            </p>
          </div>
        </div>

        {/* View Switcher: High-Performance Desktop Sliding Tab Pill */}
        <nav 
          ref={desktopNavRef}
          onMouseLeave={handleNavMouseLeave}
          aria-label="Vistas principales"
          role="tablist"
          className="hidden md:flex relative items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner"
        >
          {/* Hover Preview Pill */}
          <div 
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-slate-800/70 pointer-events-none transition-all duration-200 ease-out"
            style={{
              transform: `translateX(${hoverStyle.left}px)`,
              width: `${hoverStyle.width}px`,
              opacity: hoverStyle.opacity,
            }}
          />

          {/* Active Sliding Indicator Pill */}
          <div 
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-lg shadow-emerald-950/60 border border-emerald-400/30 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(${sliderStyle.left}px)`,
              width: `${sliderStyle.width}px`,
              opacity: sliderStyle.opacity,
            }}
          >
            {/* Subtle gloss line */}
            <div className="absolute inset-x-2 top-0.5 h-[1px] bg-white/25 rounded-full" />
          </div>

          {/* Nav Tab Buttons */}
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => { desktopTabRefs.current[tab.id] = el; }}
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewChange(tab.id)}
                onMouseEnter={() => handleTabHover(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`relative z-10 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-colors duration-200 ${
                  isActive 
                    ? 'text-white font-extrabold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {/* Badge for critical count */}
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="relative flex items-center justify-center">
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-black animate-badge-pulse border border-red-400/60 shadow-sm">
                      {tab.badgeCount}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Report Button, Sound Toggle & Quick Hotline */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              title={isSoundMuted ? 'Activar alarmas sonoras' : 'Silenciar alarmas sonoras'}
              aria-label={isSoundMuted ? 'Activar alarmas sonoras' : 'Silenciar alarmas sonoras'}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          )}

          <a
            href="tel:123"
            title="Línea Única Nacional de Emergencias 123"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-all duration-200 hover:border-sky-500/40 hover:text-white"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Línea 123</span>
          </a>

          <button
            onClick={onOpenReportModal}
            className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            <span className="absolute -inset-0.5 rounded-xl bg-emerald-500 opacity-20 blur-sm group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"></span>
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 ease-out" />
              <span className="hidden xs:inline">REPORTAR</span>
              <span className="hidden sm:inline">INCIDENTE</span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile view sub-bar: High-Performance Sliding Segmented Control */}
      <div className="md:hidden mt-2 pt-2 border-t border-slate-800/80">
        <div 
          ref={mobileNavRef}
          role="tablist"
          aria-label="Vistas móviles"
          className="relative flex items-center justify-between bg-slate-900/90 p-1 rounded-xl border border-slate-800"
        >
          {/* Sliding Pill Indicator on Mobile */}
          <div 
            className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-950/50 border border-emerald-400/30 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(${mobileSliderStyle.left}px)`,
              width: `${mobileSliderStyle.width}px`,
              opacity: mobileSliderStyle.opacity,
            }}
          />

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => { mobileTabRefs.current[tab.id] = el; }}
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewChange(tab.id)}
                className={`relative z-10 flex-1 py-1.5 px-1 flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg transition-colors duration-200 active:scale-95 ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110 text-emerald-200' : 'text-slate-400'}`} />
                <span>{tab.shortLabel}</span>

                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="ml-0.5 px-1 py-0.1 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold animate-badge-pulse">
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
