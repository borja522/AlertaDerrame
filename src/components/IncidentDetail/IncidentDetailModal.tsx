import React, { useState } from 'react';
import { Incident, IncidentStatus } from '../../types';
import { CATEGORY_METADATA } from '../../data/authorities';
import { 
  AlertOctagon, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Droplet, 
  ExternalLink, 
  Eye, 
  FileText, 
  MapPin, 
  MessageSquare, 
  PhoneCall, 
  Send, 
  ShieldAlert, 
  Trees, 
  Users, 
  Waves, 
  X 
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateStatus?: (incidentId: string, newStatus: IncidentStatus, note: string) => void;
  onAddComment?: (incidentId: string, author: string, message: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onUpdateStatus,
  onAddComment
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>(incident?.status || 'reported');
  const [statusNote, setStatusNote] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Autoridad Ambiental CAS');

  if (!incident) return null;

  const meta = CATEGORY_METADATA[incident.category];

  const handleCopyCoords = () => {
    const coordsStr = `${incident.location.lat.toFixed(6)}, ${incident.location.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleApplyStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStatus && statusNote.trim()) {
      onUpdateStatus(incident.id, newStatus, statusNote);
      setStatusNote('');
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddComment && commentText.trim()) {
      onAddComment(incident.id, commentAuthor, commentText);
      setCommentText('');
    }
  };

  const statusLabels: Record<IncidentStatus, { label: string; color: string; badge: string }> = {
    reported: { label: 'Recibido / Pendiente', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    triaged: { label: 'Triagado y Priorizado', color: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    in_investigation: { label: 'Inspección de Campo', color: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    containment_active: { label: 'Contención Activa', color: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse' },
    resolved: { label: 'Remediado y Cerrado', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${meta.badgeBg}`}>
                {meta.label}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusLabels[incident.status].badge}`}>
                {statusLabels[incident.status].label}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase ${
                incident.severity === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' :
                incident.severity === 'high' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-200'
              }`}>
                Severidad: {incident.severity}
              </span>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Folio: #{incident.folioNumber}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {incident.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Reportado {new Date(incident.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                {incident.reporter.isAnonymous ? 'Reporte Anónimo Protegido' : incident.reporter.name}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Photos Carousel / Gallery */}
          {incident.photos.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                Evidencia Fotográfica de Campo ({incident.photos.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {incident.photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative h-36 rounded-xl overflow-hidden cursor-pointer border border-slate-700/60 shadow hover:border-emerald-500 transition-all"
                  >
                    <img
                      src={photo}
                      alt={`Foto evidencia ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-medium text-white bg-slate-900/80 px-2 py-1 rounded-md backdrop-blur">
                        Ampliar foto
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-1.5">Relato Comunitario del Incidente</h4>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {incident.description}
            </p>
          </div>

          {/* Environmental Impact & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                <Waves className="w-4 h-4" />
                <span>Cuerpos de Agua</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {incident.environmentalImpact.waterSourcesAffected ? (
                  <span className="text-red-400 flex items-center gap-1">⚠️ Fuentes hídricas afectadas</span>
                ) : (
                  <span className="text-slate-400">Sin compromiso hídrico reportado</span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Trees className="w-4 h-4" />
                <span>Biodiversidad & Flora</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {incident.environmentalImpact.floraFaunaRisk ? (
                  <span className="text-amber-400">Riesgo crítico de ecosistema</span>
                ) : (
                  <span className="text-slate-400">Riesgo localizado</span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
                <Users className="w-4 h-4" />
                <span>Población en Riesgo</span>
              </div>
              <div className="text-sm font-semibold text-slate-200 font-mono">
                ~{incident.environmentalImpact.populationAtRiskApprox?.toLocaleString() || '150+'} personas
              </div>
            </div>
          </div>

          {/* Location & Geolocation Card */}
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Ubicación Georreferenciada</span>
              </div>
              <div className="text-sm font-bold text-white">
                {incident.location.address || 'Ubicación Georreferenciada'}, {incident.location.municipality}, {incident.location.department}
              </div>
              <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-2">
                <span>Lat: {incident.location.lat.toFixed(5)}°, Lng: {incident.location.lng.toFixed(5)}°</span>
                <span>• Radio Afectación: {(incident.affectedRadiusMeters / 1000).toFixed(2)} km</span>
              </div>
            </div>
            <button
              onClick={handleCopyCoords}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copiedCoords ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoords ? 'Copiado al portapapeles' : 'Copiar Coordenadas'}</span>
            </button>
          </div>

          {/* Environmental Authority Assigned */}
          <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Autoridad Ambiental Notificada
              </span>
              <a
                href={`tel:${incident.authorityAssigned.contactEmergency}`}
                className="text-xs text-sky-300 font-bold bg-sky-900/60 hover:bg-sky-800/80 px-2.5 py-1 rounded-lg border border-sky-600/40 flex items-center gap-1 transition-all"
              >
                <PhoneCall className="w-3 h-3 text-sky-400" />
                <span>{incident.authorityAssigned.contactEmergency}</span>
              </a>
            </div>
            <div className="text-base font-bold text-white">
              {incident.authorityAssigned.agencyName}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              <span className="font-semibold text-slate-200">Protocolo Operativo:</span> {incident.authorityAssigned.protocolName}
            </div>
          </div>

          {/* Timeline & Field Updates */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              Línea de Tiempo y Bitácora de Respuestas ({incident.updates?.length || 0})
            </h3>
            
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {incident.updates?.map((upd, idx) => (
                <div key={idx} className="relative pl-8 text-sm">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-emerald-400">{upd.author}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(upd.timestamp).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">{upd.message}</p>
                    {upd.newStatus && (
                      <span className="inline-block mt-2 text-[10px] uppercase font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                        Estado cambiado a: {statusLabels[upd.newStatus]?.label || upd.newStatus}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form to append an official note / action */}
            {onAddComment && (
              <form onSubmit={handlePostComment} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar anotación a la bitácora ambiental..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Protocolo de Alerta Temprana • Ley Ambiental & Gestión del Riesgo
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>

      {/* Lightbox for single photo view */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedPhoto}
            alt="Foto ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
