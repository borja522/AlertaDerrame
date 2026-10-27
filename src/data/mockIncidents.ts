import { Incident } from '../types';

export const INITIAL_MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    folioNumber: 'AMB-2026-0891',
    title: 'Ruptura de línea de flujo con derrame de crudo en quebrada La Cristalina',
    category: 'oil_spill',
    severity: 'critical',
    status: 'containment_active',
    description: 'Comunidad campesina detectó fuerte mancha oleosa y olor a hidrocarburo descendiendo por la corriente. Afecta directamente la toma de agua de 3 veredas aledañas y fauna acuática local.',
    location: {
      lat: 6.9832,
      lng: -73.8562,
      address: 'Km 14 Vía Barrancabermeja - Yondó',
      municipality: 'Barrancabermeja',
      department: 'Santander',
      accuracyMeters: 8
    },
    affectedRadiusMeters: 1400,
    photos: [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
    reporter: {
      name: 'Carlos Mendoza',
      isAnonymous: false,
      contactPhone: '+57 312 890 4421',
      organization: 'Junta de Acción Comunal Veredal'
    },
    authorityAssigned: {
      agencyName: 'ANLA / Corporación CAS',
      jurisdiction: 'Distrito Especial y Cuenca Media',
      contactEmergency: '01 8000 112 998',
      protocolName: 'Código Rojo: Plan de Contingencia Nacional de Derrames',
      notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 3.8).toISOString()
    },
    environmentalImpact: {
      waterSourcesAffected: true,
      floraFaunaRisk: true,
      populationAtRiskApprox: 1850,
      estimatedVolumeOrArea: '~120 barriles en 3.5 km lineales de corriente'
    },
    updates: [
      {
        id: 'upd-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
        author: 'Centro de Operaciones CAS',
        message: 'Reporte validado y triagado con nivel CRÍTICO. Se despacha brigada de contención con 400m de barreras absorbentes.',
        newStatus: 'triaged'
      },
      {
        id: 'upd-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
        author: 'Brigada de Respuesta Ecopetrol / HAZMAT',
        message: 'Instalación de primer punto de control con skimmer en bocatoma veredal. Cerrada válvula maestra del ducto.',
        newStatus: 'containment_active'
      }
    ]
  },
  {
    id: 'inc-002',
    folioNumber: 'AMB-2026-0892',
    title: 'Tala masiva y quemas no autorizadas en reserva forestal protectora',
    category: 'deforestation',
    severity: 'high',
    status: 'in_investigation',
    description: 'Se constató derribo con motosierras de árboles nativos centenarios (Caracolí y Cedro) para apertura de potreros ganaderos y quema de vegetación de sotobosque.',
    location: {
      lat: 6.8452,
      lng: -73.6124,
      address: 'Sector Serranía de los Yariguíes, Vereda El Mirador',
      municipality: 'San Vicente de Chucurí',
      department: 'Santander',
      accuracyMeters: 15
    },
    affectedRadiusMeters: 2800,
    photos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    reporter: {
      name: 'Guardabosques Comunitario',
      isAnonymous: true,
      organization: 'Red de Vigías de la Serranía'
    },
    authorityAssigned: {
      agencyName: 'Parques Nacionales Naturales (PNN)',
      jurisdiction: 'Parque Nacional Natural Serranía de los Yariguíes',
      contactEmergency: '320 832 9940',
      protocolName: 'Operación Artemisa de Protección de Selvas',
      notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 17.5).toISOString()
    },
    environmentalImpact: {
      waterSourcesAffected: false,
      floraFaunaRisk: true,
      populationAtRiskApprox: 120,
      estimatedVolumeOrArea: '~14.5 hectáreas de bosque andino taladas'
    },
    updates: [
      {
        id: 'upd-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        author: 'Comando de Policía Ambiental',
        message: 'Inspección aérea con drones georreferencia las coordenadas y focaliza la maquinaria pesada.',
        newStatus: 'in_investigation'
      }
    ]
  },
  {
    id: 'inc-003',
    folioNumber: 'AMB-2026-0893',
    title: 'Vertimiento de efluentes químicos y espumas tóxicas a ciénaga comunitaria',
    category: 'water_pollution',
    severity: 'critical',
    status: 'reported',
    description: 'Pescadores artesanales alertan sobre espuma densa blanquecina de 1 metro de alto con fuerte olor químico. Se observa mortandad de alevinos y especies nativas en la orilla sur.',
    location: {
      lat: 7.0651,
      lng: -73.7915,
      address: 'Ciénaga San Silvestre, sector El Llanito',
      municipality: 'Barrancabermeja',
      department: 'Santander',
      accuracyMeters: 5
    },
    affectedRadiusMeters: 1800,
    photos: [
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    reporter: {
      name: 'Asociación de Pescadores del Humedal',
      isAnonymous: false,
      contactPhone: '+57 310 445 9912',
      organization: 'ASOPESCA'
    },
    authorityAssigned: {
      agencyName: 'Secretaría de Medio Ambiente y CAR',
      jurisdiction: 'Cuenca Hídrica San Silvestre',
      contactEmergency: '01 8000 915 303',
      protocolName: 'Alerta Roja Toxicológica en Cuerpos de Agua',
      notifiedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString()
    },
    environmentalImpact: {
      waterSourcesAffected: true,
      floraFaunaRisk: true,
      populationAtRiskApprox: 4200,
      estimatedVolumeOrArea: 'Afectación directa en 2 km² de espejo de agua dulce'
    },
    updates: [
      {
        id: 'upd-4',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        author: 'Sistema EcoAlerta',
        message: 'Alerta transmitida a la estación de monitoreo limnológico. Toma de muestras en camino.'
      }
    ]
  },
  {
    id: 'inc-004',
    folioNumber: 'AMB-2026-0894',
    title: 'Disposición ilegal de canecas con solventes y lodos hidrocarburados',
    category: 'toxic_waste',
    severity: 'high',
    status: 'triaged',
    description: 'Hallazgo de más de 35 tambores metálicos corroídos con etiquetas de materiales inflamables y corrosivos dejados en una cantera abandonada.',
    location: {
      lat: 6.9123,
      lng: -73.7412,
      address: 'Antigua cantera Km 8 Vía La Fortuna',
      municipality: 'Barrancabermeja',
      department: 'Santander',
      accuracyMeters: 12
    },
    affectedRadiusMeters: 600,
    photos: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    reporter: {
      name: 'Comunidad La Fortuna',
      isAnonymous: true
    },
    authorityAssigned: {
      agencyName: 'HAZMAT Bomberos / ANLA',
      jurisdiction: 'Corredor Industrial del Magdalena Medio',
      contactEmergency: 'Línea 119 Bomberos',
      protocolName: 'Plan de Retiro y Disposición de Sustancias Peligrosas',
      notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString()
    },
    environmentalImpact: {
      waterSourcesAffected: false,
      floraFaunaRisk: true,
      populationAtRiskApprox: 350,
      estimatedVolumeOrArea: '35 barriles de 55 galones con riesgo de filtración a acuífero'
    },
    updates: [
      {
        id: 'upd-5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        author: 'Inspector Ambiental CAS',
        message: 'Inspección de campo efectuada. Sellado de seguridad y acordonamiento de 200m a la redonda.',
        newStatus: 'triaged'
      }
    ]
  },
  {
    id: 'inc-005',
    folioNumber: 'AMB-2026-0895',
    title: 'Derrame de bunker en zona portuaria de atraque de barcazas',
    category: 'oil_spill',
    severity: 'critical',
    status: 'containment_active',
    description: 'Goteo y desbordamiento durante maniobra de trasiego de combustible bunker en muelle fluvial. Mancha se desplaza aguas abajo hacia la desembocadura.',
    location: {
      lat: 7.0315,
      lng: -73.8741,
      address: 'Terminal Portuario Fluvial Río Magdalena',
      municipality: 'Barrancabermeja',
      department: 'Santander',
      accuracyMeters: 6
    },
    affectedRadiusMeters: 1200,
    photos: [
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    reporter: {
      name: 'Operador de Muelle Vigilante',
      isAnonymous: false,
      contactPhone: '+57 315 221 8844',
      organization: 'Veeduría Fluvial del Magdalena'
    },
    authorityAssigned: {
      agencyName: 'DIMAR / Capitanía de Puerto Fluvial',
      jurisdiction: 'Arteria Fluvial Magdalena Medio',
      contactEmergency: 'Línea 146 Guardacostas Fluviales',
      protocolName: 'Código MARPOL Fluvial y Control de Hidrocarburos',
      notifiedAt: new Date(Date.now() - 1000 * 60 * 105).toISOString()
    },
    environmentalImpact: {
      waterSourcesAffected: true,
      floraFaunaRisk: true,
      populationAtRiskApprox: 5400,
      estimatedVolumeOrArea: '~40 barriles de fuel-oil bunker'
    },
    updates: [
      {
        id: 'upd-6',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        author: 'Capitanía de Puerto',
        message: 'Suspensión temporal de navegación de embarcaciones menores en el sector para facilitar tendido de barreras oleofílicas.',
        newStatus: 'containment_active'
      }
    ]
  }
];
