import { EnvironmentalAuthority, IncidentCategory } from '../types';

export const ENVIRONMENTAL_AUTHORITIES: EnvironmentalAuthority[] = [
  {
    id: 'anla',
    name: 'Autoridad Nacional de Licencias Ambientales',
    acronym: 'ANLA',
    type: 'national',
    coverageDescription: 'Supervisión de proyectos de hidrocarburos, minería e infraestructura nacional.',
    emergencyHotline: '01 8000 112 998 / Línea 123',
    categoriesHandled: ['oil_spill', 'toxic_waste']
  },
  {
    id: 'dimar',
    name: 'Dirección General Marítima y Puertos',
    acronym: 'DIMAR',
    type: 'maritime',
    coverageDescription: 'Control de derrames en aguas jurisdiccionales marítimas, costas y estuarios.',
    emergencyHotline: 'Línea 146 Guardacostas',
    categoriesHandled: ['oil_spill', 'water_pollution', 'toxic_waste']
  },
  {
    id: 'car',
    name: 'Corporación Autónoma Regional Ambiental',
    acronym: 'CAR',
    type: 'regional',
    coverageDescription: 'Protección de cuencas hidrográficas, bosques nativos y control de vertimientos.',
    emergencyHotline: '01 8000 915 303',
    categoriesHandled: ['deforestation', 'water_pollution', 'toxic_waste', 'air_pollution']
  },
  {
    id: 'pnn',
    name: 'Parques Nacionales Naturales y Reservas',
    acronym: 'PNN',
    type: 'national',
    coverageDescription: 'Resguardo de ecosistemas de alta biodiversidad y lucha contra deforestación.',
    emergencyHotline: '320 832 9940',
    categoriesHandled: ['deforestation', 'toxic_waste']
  },
  {
    id: 'ungrd',
    name: 'Gestión del Riesgo de Desastres y Brigadas HAZMAT',
    acronym: 'UNGRD / HAZMAT',
    type: 'emergency',
    coverageDescription: 'Contención inmediata de emergencias químicas y desastres ambientales graves.',
    emergencyHotline: 'Línea 119 Bomberos / 123',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution']
  }
];

export function getAuthorityForCategory(category: IncidentCategory): EnvironmentalAuthority {
  const matching = ENVIRONMENTAL_AUTHORITIES.filter(a => a.categoriesHandled.includes(category));
  return matching[0] || ENVIRONMENTAL_AUTHORITIES[0];
}

export const CATEGORY_METADATA: Record<IncidentCategory, {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  iconName: string;
  description: string;
  criticalNotice: string;
}> = {
  oil_spill: {
    label: 'Derrame de Hidrocarburos',
    shortLabel: 'Derrame Crudo',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    iconName: 'Droplets',
    description: 'Fugas de crudo, oleoductos fracturados, barcazas o tanques con pérdida de combustible hacia suelos o agua.',
    criticalNotice: 'Activa protocolo inmediato de barreras de contención y skimmers con ANLA y UNGRD.'
  },
  deforestation: {
    label: 'Deforestación y Tala Ilegal',
    shortLabel: 'Tala Ilegal',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    iconName: 'TreePine',
    description: 'Quema no autorizada, desmonte de bosque primario, tala con maquinaria pesada o invasión de reservas.',
    criticalNotice: 'Despacha patrullaje conjunto con Policía Ambiental y guardabosques de Parques Nacionales.'
  },
  water_pollution: {
    label: 'Contaminación de Fuentes Hídricas',
    shortLabel: 'Contaminación Hídrica',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06b6d4',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    iconName: 'Waves',
    description: 'Descargas de aguas residuales industriales, turbidez letal para peces o vertidos mineros (mercurio/cianuro).',
    criticalNotice: 'Alerta a acueductos municipales aguas abajo para cierre preventivo de bocatomas.'
  },
  toxic_waste: {
    label: 'Vertedero Clandestino / Residuos Peligrosos',
    shortLabel: 'Residuos Tóxicos',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#a855f7',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    iconName: 'AlertTriangle',
    description: 'Baterías, químicos industriales, lodos contaminados o desechos biológicos abandonados a cielo abierto.',
    criticalNotice: 'Intervención de cuadrilla HAZMAT para aislamiento perimetral y muestreo de toxicidad.'
  },
  air_pollution: {
    label: 'Emisiones Tóxicas y Calidad del Aire',
    shortLabel: 'Emisiones Tóxicas',
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#f43f5e',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    iconName: 'Wind',
    description: 'Gases asfixiantes o corrosivos, quema masiva de llantas o emanaciones no controladas de chimeneas industriales.',
    criticalNotice: 'Medición de concentración PM2.5 / VOCs y alerta sanitaria a colegios y centros poblados.'
  }
};
