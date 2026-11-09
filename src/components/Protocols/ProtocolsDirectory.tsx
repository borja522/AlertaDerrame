import React, { useState } from 'react';
import { 
  ENVIRONMENTAL_AUTHORITIES, 
  ACTION_PROTOCOLS, 
  DIRECTORY_CATEGORIES 
} from '../../data/authorities';
import { 
  EnvironmentalAuthority, 
  AuthorityCategory, 
  ActionProtocol, 
  IncidentCategory 
} from '../../types';
import { DirectoryMap } from './DirectoryMap';
import { 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  Flame, 
  HeartPulse, 
  Layers, 
  LifeBuoy, 
  MapPin, 
  PhoneCall, 
  Radio, 
  Search, 
  Shield, 
  Sparkles, 
  TreePine, 
  X
} from 'lucide-react';
import { triggerFileDownload } from '../../utils/export';

export const ProtocolsDirectory: React.FC = () => {
  // Main Tab: Protocols or Directory
  const [activeSection, setActiveSection] = useState<'protocols' | 'directory'>('protocols');

  // Directory filter states
  const [selectedDirectoryCategory, setSelectedDirectoryCategory] = useState<AuthorityCategory | 'all'>('all');
  const [directorySearchTerm, setDirectorySearchTerm] = useState('');
  const [selectedAuthorityOnMap, setSelectedAuthorityOnMap] = useState<EnvironmentalAuthority | null>(null);

  // Protocols filter & expanded protocol state
  const [selectedProtocolCategory, setSelectedProtocolCategory] = useState<IncidentCategory | 'all'>('all');
  const [protocolSearchTerm, setProtocolSearchTerm] = useState('');
  const [expandedProtocolId, setExpandedProtocolId] = useState<string>(ACTION_PROTOCOLS[0].id);

  // Filtered Authorities
  const filteredAuthorities = ENVIRONMENTAL_AUTHORITIES.filter((auth) => {
    const matchCategory = selectedDirectoryCategory === 'all' || auth.category === selectedDirectoryCategory;
    const term = directorySearchTerm.trim().toLowerCase();
    const matchSearch = !term || 
      auth.name.toLowerCase().includes(term) ||
      auth.acronym.toLowerCase().includes(term) ||
      auth.emergencyHotline.toLowerCase().includes(term) ||
      (auth.city && auth.city.toLowerCase().includes(term)) ||
      auth.coverageDescription.toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });

  // Filtered Action Protocols
  const filteredProtocols = ACTION_PROTOCOLS.filter((prot) => {
    const matchCategory = selectedProtocolCategory === 'all' || prot.category === selectedProtocolCategory;
    const term = protocolSearchTerm.trim().toLowerCase();
    const matchSearch = !term || 
      prot.title.toLowerCase().includes(term) ||
      prot.shortTitle.toLowerCase().includes(term) ||
      prot.framework.toLowerCase().includes(term) ||
      prot.objective.toLowerCase().includes(term) ||
      prot.steps.some(s => s.title.toLowerCase().includes(term) || s.description.toLowerCase().includes(term));

    return matchCategory && matchSearch;
  });

  // Download printable protocol guide in text format
  const handleDownloadProtocolGuide = (protocol: ActionProtocol) => {
    const content = `GUÍA OPERATIVA DE CONTENCIÓN AMBIENTAL - ECOALERTA
============================================================
Protocolo: ${protocol.title}
Categoría Oficial: ${protocol.shortTitle}
Código de Activación: ${protocol.activationCode}
Marco Normativo: ${protocol.framework}

OBJETIVO OPERACIONAL
--------------------
${protocol.objective}

LÍNEAS DE RESPUESTA Y CONTACTOS DE EMERGENCIA
----------------------------------------------
${protocol.emergencyContacts.map(c => `• ${c}`).join('\n')}

EQUIPAMIENTO E INSUMOS CRÍTICOS REQUERIDOS
-------------------------------------------
${protocol.equipmentNeeded.map(e => `[ ] ${e}`).join('\n')}

LISTA DE CHEQUEO PREVENTIVA (CHECKLIST INICIAL)
-----------------------------------------------
${protocol.containmentChecklist.map(ch => `( ) ${ch}`).join('\n')}

PASO A PASO DE INTERVENCIÓN TÉCNICA
------------------------------------
${protocol.steps.map(s => `
Paso ${s.stepNumber}: ${s.title}
Responsable: ${s.responsibleRole || 'Comité Técnico Operativo'}
Descripción: ${s.description}
${s.criticalWarning ? `⚠️ ADVERTENCIA CRÍTICA: ${s.criticalWarning}` : ''}
`).join('\n')}
============================================================
Generado desde la plataforma de Alerta Temprana EcoAlerta.
Normativa: Decreto 321 de 1999 (PNC) • Ley 2111 de 2021.
`;

    triggerFileDownload(
      content,
      `Protocolo_${protocol.id.toUpperCase()}_EcoAlerta.txt`,
      'text/plain;charset=utf-8'
    );
  };

  const getCategoryIcon = (category: AuthorityCategory) => {
    switch (category) {
      case 'emergency': return <Flame className="w-4 h-4 text-red-400" />;
      case 'police': return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'environmental': return <TreePine className="w-4 h-4 text-emerald-400" />;
      case 'maritime': return <LifeBuoy className="w-4 h-4 text-sky-400" />;
      case 'health': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      default: return <Building2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (category: AuthorityCategory) => {
    switch (category) {
      case 'emergency': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'police': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'environmental': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'maritime': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'health': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/70 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Sistema Nacional de Alerta Temprana & Respuesta Institucional</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Protocolos de Contingencia & Directorio Nacional de Emergencias
          </h1>

          <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
            Manuales técnicos y directrices operacionales normalizadas según el <strong>Plan Nacional de Contingencia (Decreto 321)</strong>, junto con el directorio georreferenciado de instituciones de socorro, policía y autoridades ambientales con líneas verificadas de respuesta 24/7.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-4 border-t border-slate-700/60">
            <button
              onClick={() => setActiveSection('protocols')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow ${
                activeSection === 'protocols'
                  ? 'bg-emerald-600 text-white shadow-emerald-950/50 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Protocolos de Acción Rápida ({ACTION_PROTOCOLS.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('directory')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow ${
                activeSection === 'directory'
                  ? 'bg-emerald-600 text-white shadow-emerald-950/50 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>2. Directorio Institucional & Mapa ({ENVIRONMENTAL_AUTHORITIES.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: ACTION PROTOCOLS (Redesigned & Expanded)     */}
      {/* ========================================================= */}
      {activeSection === 'protocols' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Filter Bar for Protocols */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tipología:</span>
              </span>

              <button
                onClick={() => setSelectedProtocolCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedProtocolCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Todos ({ACTION_PROTOCOLS.length})
              </button>

              <button
                onClick={() => setSelectedProtocolCategory('oil_spill')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedProtocolCategory === 'oil_spill'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🛢️</span>
                <span>Derrames de Crudo</span>
              </button>

              <button
                onClick={() => setSelectedProtocolCategory('deforestation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedProtocolCategory === 'deforestation'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🌲</span>
                <span>Deforestación & Tala</span>
              </button>

              <button
                onClick={() => setSelectedProtocolCategory('water_pollution')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedProtocolCategory === 'water_pollution'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>💧</span>
                <span>Fuentes Hídricas</span>
              </button>

              <button
                onClick={() => setSelectedProtocolCategory('toxic_waste')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedProtocolCategory === 'toxic_waste'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>☣️</span>
                <span>Residuos Peligrosos</span>
              </button>
            </div>

            {/* Protocol Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar en protocolos técnicos..."
                value={protocolSearchTerm}
                onChange={(e) => setProtocolSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {protocolSearchTerm && (
                <button
                  onClick={() => setProtocolSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Protocols Detailed Cards Accordion / Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: List of Protocols (Cards selector) */}
            <div className="lg:col-span-5 space-y-3">
              {filteredProtocols.map((protocol) => {
                const isSelected = expandedProtocolId === protocol.id;

                return (
                  <div
                    key={protocol.id}
                    onClick={() => setExpandedProtocolId(protocol.id)}
                    className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/60 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-slate-800 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-lg shrink-0">
                          {protocol.category === 'oil_spill' && '🛢️'}
                          {protocol.category === 'deforestation' && '🌲'}
                          {protocol.category === 'water_pollution' && '💧'}
                          {protocol.category === 'toxic_waste' && '☣️'}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                            {protocol.activationCode}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-0.5 leading-snug">
                            {protocol.shortTitle}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-lg shrink-0 font-mono">
                        {protocol.steps.length} Pasos
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {protocol.objective}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span className="truncate max-w-[220px] text-slate-400 font-mono text-[10px]">
                        {protocol.framework.split('•')[0]}
                      </span>
                      <span className="text-emerald-400 font-bold hover:underline">
                        Ver protocolo completo →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Full Protocol Operational Detail */}
            <div className="lg:col-span-7">
              {(() => {
                const currentProtocol = ACTION_PROTOCOLS.find(p => p.id === expandedProtocolId) || ACTION_PROTOCOLS[0];

                return (
                  <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-700/90 space-y-6 shadow-2xl bg-slate-900/80">
                    
                    {/* Header */}
                    <div className="border-b border-slate-800 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {currentProtocol.activationCode}
                        </span>

                        <button
                          onClick={() => handleDownloadProtocolGuide(currentProtocol)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Descargar Guía (.txt)</span>
                        </button>
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                        {currentProtocol.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Marco Legal: {currentProtocol.framework}
                      </p>
                    </div>

                    {/* Objective Box */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Objetivo de Contención Inmediata</span>
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {currentProtocol.objective}
                      </p>
                    </div>

                    {/* Step-by-Step Procedure */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span>Procedimiento Operativo Estandarizado (SOP)</span>
                      </h4>

                      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                        {currentProtocol.steps.map((step) => (
                          <div key={step.stepNumber} className="relative pl-8">
                            <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center ring-4 ring-slate-900">
                              {step.stepNumber}
                            </div>
                            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-white">
                                  {step.title}
                                </h5>
                                {step.responsibleRole && (
                                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                    {step.responsibleRole}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {step.description}
                              </p>
                              {step.criticalWarning && (
                                <div className="mt-2 bg-red-950/40 border border-red-500/40 p-2 rounded-lg text-[11px] text-red-200 flex items-start gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                                  <span>{step.criticalWarning}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Two Column Grid: Checklist & Equipos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Containment Checklist */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Lista de Chequeo Inicial</span>
                        </h4>
                        <ul className="text-xs text-slate-300 space-y-2">
                          {currentProtocol.containmentChecklist.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400 font-mono font-bold">•</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Equipment */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Equipamiento Crítico Requerido</span>
                        </h4>
                        <ul className="text-xs text-slate-300 space-y-2">
                          {currentProtocol.equipmentNeeded.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-sky-400 font-mono font-bold">•</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Emergency Contacts Strip */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-950 border border-red-500/30">
                      <span className="text-[11px] font-bold uppercase text-red-300 flex items-center gap-1.5 mb-2">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Canales de Activación Inmediata</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {currentProtocol.emergencyContacts.map((contact, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            <span>{contact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: OFFICIAL DIRECTORY & INTERACTIVE MAP         */}
      {/* ========================================================= */}
      {activeSection === 'directory' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Category Filter Pills for Directory */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {DIRECTORY_CATEGORIES.map((cat) => {
                  const isSelected = selectedDirectoryCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedDirectoryCategory(cat.id as any);
                        setSelectedAuthorityOnMap(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat.id === 'emergency' && <Flame className="w-3.5 h-3.5 text-red-400" />}
                      {cat.id === 'police' && <Shield className="w-3.5 h-3.5 text-indigo-400" />}
                      {cat.id === 'environmental' && <TreePine className="w-3.5 h-3.5 text-emerald-400" />}
                      {cat.id === 'maritime' && <LifeBuoy className="w-3.5 h-3.5 text-sky-400" />}
                      {cat.id === 'health' && <HeartPulse className="w-3.5 h-3.5 text-rose-400" />}
                      {cat.id === 'all' && <Building2 className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{cat.label}</span>
                      <span className="ml-1 text-[10px] font-mono opacity-70">({cat.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Directory search input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar autoridad, ciudad o teléfono..."
                  value={directorySearchTerm}
                  onChange={(e) => setDirectorySearchTerm(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {directorySearchTerm && (
                  <button
                    onClick={() => setDirectorySearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Split View: Map (Top/Left) + Directory Cards (Bottom/Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Map Column (Independent from Monitoring Map) */}
            <div className="lg:col-span-7 h-[480px] lg:h-[620px]">
              <div className="h-full flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Ubicación Geográfica de Autoridades & Sedes Operativas</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {filteredAuthorities.length} marcadores activos
                  </span>
                </div>

                <div className="flex-1">
                  <DirectoryMap
                    authorities={ENVIRONMENTAL_AUTHORITIES}
                    selectedAuthority={selectedAuthorityOnMap}
                    onSelectAuthority={(auth) => setSelectedAuthorityOnMap(auth)}
                    selectedCategory={selectedDirectoryCategory}
                  />
                </div>
              </div>
            </div>

            {/* Directory Cards Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Directorio Telefónico Oficial</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-400">
                  Líneas Reales Verificadas
                </span>
              </div>

              {/* Scrollable list of authorities */}
              <div className="h-[480px] lg:h-[580px] overflow-y-auto space-y-3 pr-1">
                {filteredAuthorities.length === 0 ? (
                  <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
                    No se encontraron entidades con los filtros seleccionados.
                  </div>
                ) : (
                  filteredAuthorities.map((auth) => {
                    const isSelected = selectedAuthorityOnMap?.id === auth.id;

                    return (
                      <div
                        key={auth.id}
                        onClick={() => setSelectedAuthorityOnMap(auth)}
                        className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/60 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/20 shadow-lg ring-1 ring-emerald-500/40'
                            : 'border-slate-800 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                              {getCategoryIcon(auth.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(auth.category)}`}>
                                  {auth.acronym}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {auth.type}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-snug hover:text-emerald-400 transition-colors">
                                {auth.name}
                              </h4>
                            </div>
                          </div>

                          <a
                            href={`tel:${auth.emergencyHotline.split('/')[0].replace(/[^\d+]/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40 flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                            title={`Marcar a ${auth.emergencyHotline}`}
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Llamar</span>
                          </a>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {auth.coverageDescription}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{auth.address || 'Sede Central'}, {auth.city}</span>
                          </div>

                          <div className="font-mono text-emerald-400 font-bold text-[11px]">
                            {auth.emergencyHotline}
                          </div>
                        </div>

                        {auth.availableHours && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{auth.availableHours}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
