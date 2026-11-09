import { IncidentCategory, IncidentSeverity, IncidentSortOption, IncidentStatus } from '../types';

export const APP_CONFIG = {
  APP_NAME: 'EcoAlerta',
  APP_VERSION: '1.2.0',
  DEFAULT_MAP_CENTER: { lat: 7.0653, lng: -73.8547 }, // Barrancabermeja / Magdalena Medio region
  DEFAULT_ZOOM: 7,
  STORAGE_KEY_INCIDENTS: 'ecoalerta_incidents_v1',
  STORAGE_KEY_SOUND_MUTED: 'ecoalerta_sound_muted_v1',
  TOAST_DURATION_MS: 4500,
} as const;

export const SEVERITY_WEIGHTS: Record<IncidentSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const STATUS_LABELS: Record<IncidentStatus, { label: string; badge: string; color: string }> = {
  reported: { 
    label: 'Reportado', 
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    color: 'text-amber-400' 
  },
  triaged: { 
    label: 'Triagado y Priorizado', 
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    color: 'text-sky-400' 
  },
  in_investigation: { 
    label: 'Inspección de Campo', 
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    color: 'text-indigo-400' 
  },
  containment_active: { 
    label: 'Contención Activa', 
    badge: 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse font-bold',
    color: 'text-red-400' 
  },
  resolved: { 
    label: 'Remediado y Cerrado', 
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    color: 'text-emerald-400' 
  },
};

export const SORT_OPTIONS: { value: IncidentSortOption; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'severity_desc', label: 'Mayor severidad' },
  { value: 'radius_desc', label: 'Mayor radio afectado' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'title_asc', label: 'Alfabético (A-Z)' },
];

export const COLOMBIAN_DEPARTMENTS: string[] = [
  'Santander',
  'Antioquia',
  'Bolívar',
  'Cesar',
  'Boyacá',
  'Cundinamarca',
  'Meta',
  'Arauca',
  'Casanare',
  'Putumayo',
  'Nariño',
  'Valle del Cauca',
  'Chocó',
  'Magdalena',
  'Atlántico',
  'La Guajira',
  'Sucre',
  'Córdoba',
  'Huila',
  'Tolima',
  'Caldas',
  'Risaralda',
  'Quindío',
  'Norte de Santander',
  'Amazonas',
  'Caquetá',
  'Guainía',
  'Guaviare',
  'Vaupés',
  'Vichada',
  'San Andrés y Providencia'
];
