import { useState, useEffect } from 'react';
import type { Incident, IncidentCategory, IncidentSeverity, IncidentStatus } from './types';
import { loadStoredIncidents, saveIncidents, resetToDemoIncidents } from './utils/storage';
import { Navbar } from './components/Navigation/Navbar';
import { IncidentMap } from './components/Map/IncidentMap';
import { IncidentDetailModal } from './components/IncidentDetail/IncidentDetailModal';
import { ReportIncidentModal } from './components/ReportModal/ReportIncidentModal';
import { AuthorityDashboard } from './components/Authority/AuthorityDashboard';
import { ProtocolsDirectory } from './components/Protocols/ProtocolsDirectory';
import { CATEGORY_METADATA } from './data/authorities';
import { 
  ChevronRight, 
  Crosshair, 
  Filter, 
  MapPin, 
  Plus, 
  Radio, 
  RotateCcw 
} from 'lucide-react';

export function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'map' | 'dashboard' | 'protocols'>('map');

  // Map picking state
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Map feed filters
  const [mapCategoryFilter, setMapCategoryFilter] = useState<IncidentCategory | 'all'>('all');
  const [mapSeverityFilter, setMapSeverityFilter] = useState<IncidentSeverity | 'all'>('all');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const data = loadStoredIncidents();
    setIncidents(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Add new incident
  const handleCreateIncident = (newIncident: Incident) => {
    const updated = [newIncident, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    setIsPickingLocation(false);
    setPickedCoords(null);
    showToast(`¡Alerta ambiental #${newIncident.folioNumber} transmitida a la autoridad con éxito!`);
  };

  // Update status
  const handleUpdateStatus = (incidentId: string, newStatus: IncidentStatus, note: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        const newUpdate = {
          id: `upd-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Despacho de Control Ambiental',
          message: note || `Estado actualizado a ${newStatus}`,
          newStatus
        };
        return {
          ...inc,
          status: newStatus,
          updates: [newUpdate, ...(inc.updates || [])]
        };
      }
      return inc;
    });

    setIncidents(updated);
    saveIncidents(updated);

    if (selectedIncident && selectedIncident.id === incidentId) {
      const fresh = updated.find(i => i.id === incidentId);
      if (fresh) setSelectedIncident(fresh);
    }

    showToast(`Estado del incidente actualizado a: ${newStatus}`);
  };

  // Add comment / update note
  const handleAddComment = (incidentId: string, author: string, message: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        const newUpdate = {
          id: `upd-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author,
          message
        };
        return {
          ...inc,
          updates: [...(inc.updates || []), newUpdate]
        };
      }
      return inc;
    });

    setIncidents(updated);
    saveIncidents(updated);

    if (selectedIncident && selectedIncident.id === incidentId) {
      const fresh = updated.find(i => i.id === incidentId);
      if (fresh) setSelectedIncident(fresh);
    }

    showToast('Anotación agregada a la bitácora pericial');
  };

  // Handle location picking from map
  const handleMapLocationPicked = (lat: number, lng: number) => {
    setPickedCoords({ lat, lng });
    if (isPickingLocation) {
      setIsPickingLocation(false);
      setIsReportModalOpen(true);
      showToast(`Punto fijado en GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleStartPickingLocation = () => {
    setIsPickingLocation(true);
    setCurrentView('map');
  };

  // Reset demo
  const handleResetDemo = () => {
    if (window.confirm('¿Deseas restaurar los incidentes a la muestra inicial de demostración?')) {
      const initial = resetToDemoIncidents();
      setIncidents(initial);
      showToast('Datos de demostración restablecidos.');
    }
  };

  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

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
      />

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
                setMapSeverityFilter('critical');
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
                  onClick={() => setMapCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    mapCategoryFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({incidents.length})
                </button>

                <button
                  onClick={() => setMapCategoryFilter('oil_spill')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    mapCategoryFilter === 'oil_spill'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛢️</span>
                  <span>Derrames Hidrocarburos</span>
                </button>

                <button
                  onClick={() => setMapCategoryFilter('deforestation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    mapCategoryFilter === 'deforestation'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🌲</span>
                  <span>Deforestación</span>
                </button>

                <button
                  onClick={() => setMapCategoryFilter('water_pollution')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    mapCategoryFilter === 'water_pollution'
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
                  filterCategory={mapCategoryFilter}
                  filterSeverity={mapSeverityFilter}
                />
              </div>

              {/* Incidents Live Stream / Feed Column */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Reportes Comunitarios</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Pines georreferenciados en tiempo real
                    </p>
                  </div>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Reportar</span>
                  </button>
                </div>

                {/* Scrollable incidents list */}
                <div className="h-[480px] lg:h-[600px] overflow-y-auto space-y-3 pr-1">
                  {incidents
                    .filter(inc => {
                      const matchCat = mapCategoryFilter === 'all' || inc.category === mapCategoryFilter;
                      const matchSev = mapSeverityFilter === 'all' || inc.severity === mapSeverityFilter;
                      return matchCat && matchSev;
                    })
                    .map((inc) => {
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
                                <span className="font-mono text-emerald-400 font-semibold">{(inc.affectedRadiusMeters / 1000).toFixed(1)} km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
