import React from 'react';
import { ENVIRONMENTAL_AUTHORITIES, CATEGORY_METADATA } from '../../data/authorities';
import { 
  AlertOctagon, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Info, 
  LifeBuoy, 
  PhoneCall, 
  Radio, 
  ShieldAlert, 
  TreePine, 
  Waves 
} from 'lucide-react';

export const ProtocolsDirectory: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/60 border border-slate-700/80 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Guía de Acción y Respuesta Comunitaria</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Protocolos de Emergencia Ambiental y Directorio Oficial
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Directrices para líderes comunitarios, guardabosques y ciudadanos ante eventos de contaminación por hidrocarburos, deforestación y delitos ambientales.
          </p>
        </div>
      </div>

      {/* Emergency Protocols Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Protocolos Inmediatos por Tipología de Incidente</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Protocol 1: Derrame */}
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
                🛢️
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Derrame de Crudo / Hidrocarburos</h4>
                <span className="text-[11px] text-amber-400 font-semibold">Plan de Contingencia Nacional</span>
              </div>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>No fumar ni encender fuentes de ignición</strong> o motores dentro de un radio de 500m por riesgo de gases inflamables.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Alertar a acueductos comunitarios</strong> y bocatomas aguas abajo para el cierre preventivo inmediato.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Despachar reporte en <strong>EcoAlerta</strong> para activar brigadas HAZMAT con barreras oleofílicas.</span>
              </li>
            </ul>
          </div>

          {/* Protocol 2: Deforestación */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                🌲
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Tala Ilegal & Quemas</h4>
                <span className="text-[11px] text-emerald-400 font-semibold">Operación de Protección Forestal</span>
              </div>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Evitar confrontaciones físicas directas</strong> con taladores ilegales armados o invasores.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Georreferenciar el polígono de desmonte</strong> y caminos de trocha abiertos para maquinaria.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Remitir a <strong>Parques Nacionales</strong> y Policía Ambiental para intervención pericial.</span>
              </li>
            </ul>
          </div>

          {/* Protocol 3: Contaminación Hídrica */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg">
                💧
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Vertimientos Tóxicos en Agua</h4>
                <span className="text-[11px] text-cyan-400 font-semibold">Alerta Toxicológica Limnológica</span>
              </div>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Prohibir el consumo y baño</strong> para personas y ganado en el cuerpo de agua señalado.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Documentar fotográficamente presencia de espuma, peces muertos o cambios de color en el agua.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Coordinar con la Corporación Ambiental Regional toma de muestras con cadena de custodia.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Authorities Directory */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Directorio de Autoridades Ambientales Competentes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ENVIRONMENTAL_AUTHORITIES.map((auth) => (
            <div key={auth.id} className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Jurisdicción {auth.type}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">{auth.name} ({auth.acronym})</h4>
                </div>
                <a
                  href={`tel:${auth.emergencyHotline.split('/')[0]}`}
                  className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Llamar</span>
                </a>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {auth.coverageDescription}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Línea de Emergencia:</span>
                <span className="font-mono text-emerald-400 font-bold">{auth.emergencyHotline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
