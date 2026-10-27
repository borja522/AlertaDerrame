import React from 'react';
import { 
  AlertTriangle, 
  BookOpen, 
  LifeBuoy, 
  Map, 
  PhoneCall, 
  PlusCircle, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  Waves 
} from 'lucide-react';

interface NavbarProps {
  currentView: 'map' | 'dashboard' | 'protocols';
  onViewChange: (view: 'map' | 'dashboard' | 'protocols') => void;
  onOpenReportModal: () => void;
  activeCriticalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenReportModal,
  activeCriticalCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onViewChange('map')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 blur-sm group-hover:opacity-100 transition duration-300"></span>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
              <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Eco<span className="text-emerald-400">Alerta</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Red Comunitaria
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Georreferenciación & Alerta Temprana de Incidentes Ambientales
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onViewChange('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'map'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Mapa & Monitoreo</span>
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Gestión Autoridades</span>
            {activeCriticalCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-mono flex items-center justify-center animate-bounce">
                {activeCriticalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('protocols')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'protocols'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Protocolos & Directorio</span>
          </button>
        </nav>

        {/* Right Action: Report Button & Quick Hotline */}
        <div className="flex items-center gap-2.5">
          <a
            href="tel:123"
            title="Línea Única Nacional de Emergencias 123"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Línea 123</span>
          </a>

          <button
            onClick={onOpenReportModal}
            className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/50 active:scale-95 transition-all"
          >
            <span className="absolute -inset-0.5 rounded-xl bg-emerald-500 opacity-30 blur-sm group-hover:opacity-75 transition duration-200"></span>
            <div className="relative flex items-center gap-2">
              <PlusCircle className="w-4 h-4 animate-spin-slow" />
              <span>REPORTAR INCIDENTE</span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile view sub-bar */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-slate-800/80 text-xs">
        <button
          onClick={() => onViewChange('map')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${currentView === 'map' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-400'}`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Mapa</span>
        </button>
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${currentView === 'dashboard' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-400'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Autoridades {activeCriticalCount > 0 ? `(${activeCriticalCount})` : ''}</span>
        </button>
        <button
          onClick={() => onViewChange('protocols')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${currentView === 'protocols' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-400'}`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Protocolos</span>
        </button>
      </div>
    </header>
  );
};
