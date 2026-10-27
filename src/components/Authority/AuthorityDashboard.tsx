import React, { useState } from 'react';
import { Incident, IncidentCategory, IncidentSeverity, IncidentStatus } from '../../types';
import { CATEGORY_METADATA } from '../../data/authorities';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Droplet, 
  Eye, 
  Filter, 
  Flame, 
  Layers, 
  MapPin, 
  Radio, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  TreePine, 
  Volume2, 
  Waves 
} from 'lucide-react';
import { playEmergencySirenSound } from '../../utils/audio';

interface AuthorityDashboardProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onUpdateStatus: (incidentId: string, newStatus: IncidentStatus, note: string) => void;
  onLocateOnMap: (incident: Incident) => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  incidents,
  onSelectIncident,
  onUpdateStatus,
  onLocateOnMap
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<IncidentCategory | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');

  // Filtered list
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.folioNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.location.municipality && inc.location.municipality.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inc.location.address && inc.location.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = filterCategory === 'all' || inc.category === filterCategory;
    const matchesSev = filterSeverity === 'all' || inc.severity === filterSeverity;
    const matchesStat = filterStatus === 'all' || inc.status === filterStatus;

    return matchesSearch && matchesCat && matchesSev && matchesStat;
  });

  // KPI Calculations
  const totalCritical = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const oilSpillsCount = incidents.filter(i => i.category === 'oil_spill' && i.status !== 'resolved').length;
  const deforestationCount = incidents.filter(i => i.category === 'deforestation' && i.status !== 'resolved').length;
  const activeContainment = incidents.filter(i => i.status === 'containment_active').length;

  const statusMap: Record<IncidentStatus, { label: string; badge: string }> = {
    reported: { label: 'Reportado', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    triaged: { label: 'Triagado', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    in_investigation: { label: 'En Campo', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    containment_active: { label: 'Contención Activa', badge: 'bg-red-500/20 text-red-300 border-red-500/30 font-bold animate-pulse' },
    resolved: { label: 'Remediado', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Folio', 'Titulo', 'Categoria', 'Severidad', 'Estado', 'Municipio', 'Latitud', 'Longitud', 'Radio_Metros', 'Fecha'];
    const rows = filteredIncidents.map(inc => [
      inc.folioNumber,
      `"${inc.title.replace(/"/g, '""')}"`,
      inc.category,
      inc.severity,
      inc.status,
      `"${inc.location.municipality || ''}"`,
      inc.location.lat,
      inc.location.lng,
      inc.affectedRadiusMeters,
      inc.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EcoAlerta_Reportes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Alertas Críticas</span>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
            {totalCritical}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Intervención de emergencia obligatoria</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Derrames de Crudo</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
            {oilSpillsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Barreras oleofílicas y skimmers</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Deforestación</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
            {deforestationCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Monitoreo satelital de biomasa</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-sky-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Contención Activa</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
            {activeContainment}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cuadrillas operando en campo</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, folio (AMB-2026-...) o municipio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => playEmergencySirenSound()}
              className="px-3 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold rounded-xl border border-red-800/40 flex items-center gap-1.5 transition-all"
              title="Probar sonido de alarma de emergencia"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sirena Test</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all shadow"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtros:</span>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as IncidentCategory | 'all')}
            className="bg-slate-900 border border-slate-700/80 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas las Categorías</option>
            <option value="oil_spill">🛢️ Derrames de Hidrocarburos</option>
            <option value="deforestation">🌲 Deforestación y Tala</option>
            <option value="water_pollution">💧 Contaminación Hídrica</option>
            <option value="toxic_waste">☣️ Residuos Peligrosos</option>
            <option value="air_pollution">💨 Emisiones Tóxicas</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as IncidentSeverity | 'all')}
            className="bg-slate-900 border border-slate-700/80 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas las Severidades</option>
            <option value="critical">🚨 Crítica</option>
            <option value="high">⚠️ Alta</option>
            <option value="medium">ℹ️ Moderada</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | 'all')}
            className="bg-slate-900 border border-slate-700/80 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todos los Estados</option>
            <option value="reported">Reportado</option>
            <option value="triaged">Triagado</option>
            <option value="in_investigation">En Inspección</option>
            <option value="containment_active">Contención Activa</option>
            <option value="resolved">Remediado</option>
          </select>

          <span className="text-[11px] text-slate-500 ml-auto font-mono">
            Mostrando {filteredIncidents.length} de {incidents.length} incidentes
          </span>
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400">
            <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No se encontraron incidentes con los filtros seleccionados.</p>
            <p className="text-xs text-slate-500 mt-1">Prueba restableciendo los filtros o buscando otro término.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const meta = CATEGORY_METADATA[inc.category];
            const stat = statusMap[inc.status];
            const isCritical = inc.severity === 'critical';

            return (
              <div
                key={inc.id}
                className={`glass-panel p-4 rounded-2xl border transition-all hover:border-slate-600 ${
                  isCritical ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left Column: Photo & Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={inc.photos[0] || 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=400&q=80'}
                      alt={inc.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-700 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${meta.badgeBg}`}>
                          {meta.shortLabel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${stat.badge}`}>
                          {stat.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          inc.severity === 'critical' ? 'bg-red-600 text-white' :
                          inc.severity === 'high' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {inc.folioNumber}
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectIncident(inc)}
                        className="text-sm sm:text-base font-bold text-white hover:text-emerald-400 cursor-pointer truncate transition-colors"
                      >
                        {inc.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{inc.location.municipality || 'Barrancabermeja'}, {inc.location.department}</span>
                        </span>
                        <span className="text-slate-500">•</span>
                        <span>Radio: <strong className="text-slate-300 font-mono">{(inc.affectedRadiusMeters / 1000).toFixed(1)} km</strong></span>
                        <span className="text-slate-500">•</span>
                        <span>Autoridad: <strong className="text-sky-400">{inc.authorityAssigned.agencyName.split('/')[0]}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status Switcher & Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                    {/* Status change select */}
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Estado:</span>
                      <select
                        value={inc.status}
                        onChange={(e) => onUpdateStatus(inc.id, e.target.value as IncidentStatus, `Estado actualizado a ${e.target.value} por despacho ambiental`)}
                        className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="reported" className="bg-slate-900 text-amber-300">Reportado</option>
                        <option value="triaged" className="bg-slate-900 text-sky-300">Triagado</option>
                        <option value="in_investigation" className="bg-slate-900 text-indigo-300">En Inspección</option>
                        <option value="containment_active" className="bg-slate-900 text-red-300">Contención Activa</option>
                        <option value="resolved" className="bg-slate-900 text-emerald-300">Remediado</option>
                      </select>
                    </div>

                    <button
                      onClick={() => onLocateOnMap(inc)}
                      title="Centrar en el mapa satelital"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition-colors flex items-center justify-center"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectIncident(inc)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Expediente</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
