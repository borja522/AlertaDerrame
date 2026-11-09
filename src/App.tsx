import { useState, useCallback, useRef } from 'react';
import type { Incident, IncidentStatus } from './types';
import { Navbar } from './components/Navigation/Navbar';
import { IncidentMap } from './components/Map/IncidentMap';
import { IncidentDetailModal } from './components/IncidentDetail/IncidentDetailModal';
import { ReportIncidentModal } from './components/ReportModal/ReportIncidentModal';
import { AuthorityDashboard } from './components/Authority/AuthorityDashboard';
import { ProtocolsDirectory } from './components/Protocols/ProtocolsDirectory';
import { CATEGORY_METADATA } from './data/authorities';
import { useIncidents } from './hooks/useIncidents';
import { useSoundAlerts } from './hooks/useSoundAlerts';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { auditService } from './services/auditService';
import { formatRadius } from './utils/formatters';
import { SORT_OPTIONS, APP_CONFIG } from './constants';
import { playEmergencySirenSound } from './utils/audio';
import { 
  ArrowUpDown,
  ChevronRight, 
  Crosshair, 
  Download,
  Filter, 
  MapPin, 
  Plus, 
  Radio, 
  RotateCcw,
  Search,
  WifiOff,
  X
} from 'lucide-react';

export function App() {
  const {
    incidents,
    filteredIncidents,
    selectedIncident,
    setSelectedIncident,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    severityFilter,
    setSeverityFilter,
    sortBy,
    setSortBy,
    createIncident,
    updateStatus,
    addComment,
    resetDemo,
    exportCSV,
    criticalCount,
  } = useIncidents();

  const { isMuted, toggleMute, playSuccess } = useSoundAlerts();
  const networkStatus = useNetworkStatus();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Navigation & Modals
  const [currentView, setCurrentView] = useState<'map' | 'dashboard' | 'protocols'>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Map picking state
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, APP_CONFIG.TOAST_DURATION_MS);
  }, []);

  // Keyboard shortcut handlers
  useKeyboardShortcuts({
    onEscape: () => {
      if (selectedIncident) setSelectedIncident(null);
      if (isReportModalOpen) setIsReportModalOpen(false);
      if (isPickingLocation) setIsPickingLocation(false);
    },
    onMapView: () => setCurrentView('map'),
    onDashboardView: () => setCurrentView('dashboard'),
    onProtocolsView: () => setCurrentView('protocols'),
    onFocusSearch: () => {
      if (currentView === 'map' && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    onToggleMute: toggleMute,
  });

  // Wrap incident creation with audio chime, audit & toast
  const handleCreateIncident = useCallback((newIncident: Incident) => {
    createIncident(newIncident);

    if (newIncident.severity === 'critical') {
       playEmergencySirenSound();
    }
    auditService.log('incident_created', `Alerta #${newIncident.folioNumber}: ${newIncident.title}`, newIncident.folioNumber);
    setIsPickingLocation(false);
    setPickedCoords(null);
    playSuccess();
    showToast(`¡Alerta ambiental #${newIncident.folioNumber} transmitida a la autoridad con éxito!`);
  }, [createIncident, playSuccess, showToast]);

  const handleUpdateStatus = useCallback((incidentId: string, newStatus: IncidentStatus, note: string) => {
    updateStatus(incidentId, newStatus, note);
    auditService.log('status_changed', `Estado actualizado a ${newStatus}. ${note || ''}`, incidentId);
    showToast(`Estado del incidente actualizado a: ${newStatus}`);
  }, [updateStatus, showToast]);

  const handleAddComment = useCallback((incidentId: string, author: string, message: string) => {
    addComment(incidentId, author, message);
    auditService.log('comment_added', `Anotación pericial por ${author}: ${message}`, incidentId);
    showToast('Anotación agregada a la bitácora pericial');
  }, [addComment, showToast]);

  // Handle location picking from map
  const handleMapLocationPicked = useCallback((lat: number, lng: number) => {
    setPickedCoords({ lat, lng });
    auditService.log('location_picked', `Coordenadas fijadas en mapa: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    if (isPickingLocation) {
      setIsPickingLocation(false);
      setIsReportModalOpen(true);
      showToast(`Punto fijado en GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }, [isPickingLocation, showToast]);

  const handleStartPickingLocation = useCallback(() => {
    setIsPickingLocation(true);
    setCurrentView('map');
  }, []);

  // Reset demo data
  const handleResetDemo = useCallback(() => {
    if (window.confirm('¿Deseas restaurar los incidentes a la muestra inicial de demostración?')) {
      resetDemo();
      auditService.log('demo_reset', 'Datos restablecidos a la muestra base de prueba');
      showToast('Datos de demostración restablecidos.');
    }
  }, [resetDemo, showToast]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 animate-bounce">
          <div className="glass-panel px-4 py-3 rounded-2xl border border-emerald-500/50 shadow-2xl flex items-center gap-3 text-xs font-bold text-emerald-300">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setIsPickingLocation(false);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeCriticalCount={criticalCount}
        isSoundMuted={isMuted}
        onToggleSound={toggleMute}
      />

      {/* Offline Connectivity Notification Banner */}
      {!networkStatus.isOnline && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Modo sin conexión: los cambios y reportes se conservan en la memoria local.</span>
        </div>
      )}

      {/* Critical Spill Emergency Notification Banner */}
      {criticalCount > 0 && (
        <div className="bg-gradient-to-r from-red-950 via-red-900/80 to-slate-950 border-b border-red-500/40 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-bold uppercase tracking-wider text-white">Emergencia Ambiental Activa:</span>
              <span className="hidden sm:inline">Hay {criticalCount} reporte(s) crítico(s) de derrames o afectación en fuentes hídricas bajo contención.</span>
            </div>
            <button
              onClick={() => {
                setSeverityFilter('critical');
                setCurrentView('map');
              }}
              className="text-[11px] font-bold text-red-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
            >
              <span>Ver focos críticos en mapa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Picking Location Banner */}
      {isPickingLocation && (
        <div className="bg-emerald-950 border-b border-emerald-500/50 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 animate-spin-slow text-emerald-400" />
              <span className="font-bold">Modo de Selección de Coordenadas:</span>
              <span>Haz clic en el punto exacto del mapa donde ocurrió el derrame o tala.</span>
            </div>
            <button
              onClick={() => setIsPickingLocation(false)}
              className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px]"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* VIEW 1: INTERACTIVE MAP & COMMUNITY FEED */}
        {currentView === 'map' && (
          <div className="space-y-6">
            
            {/* Top Quick Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  Filtrar Mapa:
                </span>

                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({incidents.length})
                </button>

                <button
                  onClick={() => setCategoryFilter('oil_spill')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    categoryFilter === 'oil_spill'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛢️</span>
                  <span>Derrames Hidrocarburos</span>
                </button>

                <button
                  onClick={() => setCategoryFilter('deforestation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    categoryFilter === 'deforestation'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🌲</span>
                  <span>Deforestación</span>
                </button>

                <button
                  onClick={() => setCategoryFilter('water_pollution')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    categoryFilter === 'water_pollution'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💧</span>
                  <span>Agua / Vertimientos</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  title="Exportar reportes a CSV"
                  className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800 flex items-center gap-1 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>

                <button
                  onClick={handleResetDemo}
                  title="Restaurar datos de prueba"
                  className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800 flex items-center gap-1 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Demo Base</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Large Map (65%) + Side Incident Cards (35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Map Column */}
              <div className="lg:col-span-8 h-[550px] lg:h-[680px]">
                <IncidentMap
                  incidents={incidents}
                  selectedIncident={selectedIncident}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  isPickingLocation={isPickingLocation}
                  pickedLocation={pickedCoords}
                  onLocationPicked={handleMapLocationPicked}
                  filterCategory={categoryFilter}
                  filterSeverity={severityFilter}
                />
              </div>

              {/* Incidents Live Stream / Feed Column */}
              <div className="lg:col-span-4 space-y-3">
                <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>Reportes Comunitarios</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {filteredIncidents.length} de {incidents.length} registros visibles
                      </p>
                    </div>
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Reportar</span>
                    </button>
                  </div>

                  {/* Inline Search in Feed */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar por título, folio o municipio... (presiona /)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                      <span>Ordenar:</span>
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-emerald-500"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Scrollable incidents list */}
                <div className="h-[430px] lg:h-[530px] overflow-y-auto space-y-3 pr-1">
                  {filteredIncidents.length === 0 ? (
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
                      No se encontraron reportes con los criterios actuales.
                    </div>
                  ) : (
                    filteredIncidents.map((inc) => {
                      const meta = CATEGORY_METADATA[inc.category];
                      const isSelected = selectedIncident?.id === inc.id;

                      return (
                        <div
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          className={`glass-panel p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/60 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-950/20 shadow-lg'
                              : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={inc.photos[0] || 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=400&q=80'}
                              alt={inc.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700/60"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${meta.badgeBg}`}>
                                  {meta.shortLabel}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                  inc.severity === 'critical' ? 'bg-red-600 text-white' :
                                  inc.severity === 'high' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                                }`}>
                                  {inc.severity}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-white truncate hover:text-emerald-400">
                                {inc.title}
                              </h4>

                              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="truncate">{inc.location.municipality || 'Barrancabermeja'}</span>
                                <span>•</span>
                                <span className="font-mono text-emerald-400 font-semibold">{formatRadius(inc.affectedRadiusMeters)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: AUTHORITY MANAGEMENT DASHBOARD */}
        {currentView === 'dashboard' && (
          <AuthorityDashboard
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onUpdateStatus={handleUpdateStatus}
            onLocateOnMap={(inc) => {
              setSelectedIncident(inc);
              setCurrentView('map');
            }}
          />
        )}

        {/* VIEW 3: PROTOCOLS & OFFICIAL DIRECTORY */}
        {currentView === 'protocols' && (
          <ProtocolsDirectory />
        )}

      </main>

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
      />

      {/* Citizen Incident Report Wizard Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIncident={handleCreateIncident}
        currentMapCoords={selectedIncident ? { lat: selectedIncident.location.lat, lng: selectedIncident.location.lng } : undefined}
        onStartMapPick={handleStartPickingLocation}
        pickedCoords={pickedCoords}
      />

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-400">EcoAlerta</span>
            <span>— Red Comunitaria de Vigilancia Satelital & Control de Derrames</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ANLA • DIMAR • Parques Nacionales • CAR</span>
            <span>Vite + React + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
