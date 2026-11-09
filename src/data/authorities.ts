import { EnvironmentalAuthority, IncidentCategory, ActionProtocol } from '../types';

export const ENVIRONMENTAL_AUTHORITIES: EnvironmentalAuthority[] = [
  // 1. Autoridades Ambientales y Licenciamiento
  {
    id: 'anla',
    name: 'Autoridad Nacional de Licencias Ambientales',
    acronym: 'ANLA',
    type: 'national',
    category: 'environmental',
    coverageDescription: 'Supervisión de contingencias del sector hidrocarburos, minería a gran escala y megaproyectos.',
    emergencyHotline: '01 8000 112 998',
    directPhone: '(601) 352 4200',
    address: 'Calle 37 # 8-40',
    city: 'Bogotá D.C. / Cobertura Nacional',
    coordinates: { lat: 4.6242, lng: -74.0682 },
    website: 'https://www.anla.gov.co',
    categoriesHandled: ['oil_spill', 'toxic_waste'],
    availableHours: '24 Horas / Centro de Control'
  },
  {
    id: 'cas',
    name: 'Corporación Autónoma Regional de Santander',
    acronym: 'CAS',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Autoridad ambiental territorial del Magdalena Medio, cuencas hídricas del río Sogamoso y provincia de Mares.',
    emergencyHotline: '01 8000 915 303',
    directPhone: '(607) 724 3623',
    address: 'Carrera 12 # 9-02',
    city: 'San Gil / Regional Barrancabermeja',
    coordinates: { lat: 7.0628, lng: -73.8495 },
    website: 'https://cas.gov.co',
    categoriesHandled: ['oil_spill', 'deforestation', 'water_pollution', 'toxic_waste'],
    availableHours: 'Lunes a Viernes 7:30 AM - 5:30 PM (Línea de emergencia 24/7)'
  },
  {
    id: 'cdmb',
    name: 'Corporación para la Defensa de la Meseta de Bucaramanga',
    acronym: 'CDMB',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Protección ambiental metropolitana y fuentes hídricas abastecedoras en Santander.',
    emergencyHotline: '01 8000 910 882',
    directPhone: '(607) 634 6100',
    address: 'Carrera 23 # 37-63',
    city: 'Bucaramanga, Santander',
    coordinates: { lat: 7.1193, lng: -73.1227 },
    website: 'https://cdmb.gov.co',
    categoriesHandled: ['water_pollution', 'deforestation', 'toxic_waste'],
    availableHours: '24 Horas atención de emergencias'
  },
  {
    id: 'pnn',
    name: 'Parques Nacionales Naturales de Colombia',
    acronym: 'PNN',
    type: 'national',
    category: 'environmental',
    coverageDescription: 'Resguardo de ecosistemas protegidos, biodiversidad y combate directo a la deforestación de bosques primarios.',
    emergencyHotline: '01 8000 912 607',
    directPhone: '320 832 9940',
    address: 'Calle 74 # 11-81',
    city: 'Bogotá / Dirección Territorial Andes Nororientales',
    coordinates: { lat: 4.6601, lng: -74.0583 },
    website: 'https://www.parquesnacionales.gov.co',
    categoriesHandled: ['deforestation', 'toxic_waste'],
    availableHours: '24/7 Brigadas Guardaparques'
  },
  {
    id: 'minambiente',
    name: 'Ministerio de Ambiente y Desarrollo Sostenible',
    acronym: 'MinAmbiente',
    type: 'national',
    category: 'environmental',
    coverageDescription: 'Órgano rector de la gestión del medio ambiente y de los recursos naturales renovables en Colombia.',
    emergencyHotline: '01 8000 919 301',
    directPhone: '(601) 332 3400',
    address: 'Calle 37 # 8-40',
    city: 'Bogotá D.C.',
    coordinates: { lat: 4.6235, lng: -74.0678 },
    website: 'https://www.minambiente.gov.co',
    categoriesHandled: ['oil_spill', 'deforestation', 'water_pollution', 'toxic_waste', 'air_pollution'],
    availableHours: 'Lunes a Viernes 8:00 AM - 5:00 PM'
  },

  // 2. Cuerpos de Bomberos, HAZMAT y Gestión del Riesgo
  {
    id: 'bomberos-barranca',
    name: 'Cuerpo de Bomberos Voluntarios de Barrancabermeja',
    acronym: 'BOMBEROS BARRANCA',
    type: 'emergency',
    category: 'emergency',
    coverageDescription: 'Brigadas especializadas HAZMAT en contención de hidrocarburos, incendios de tanques y materiales peligrosos en Magdalena Medio.',
    emergencyHotline: 'Línea 119',
    directPhone: '(607) 622 2222',
    address: 'Calle 49 # 10-18, Barrio Colombia',
    city: 'Barrancabermeja, Santander',
    coordinates: { lat: 7.0653, lng: -73.8547 },
    website: 'https://bomberoscolombia.gov.co',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution'],
    availableHours: '24 Horas / Guardia Permanente'
  },
  {
    id: 'dnbc',
    name: 'Dirección Nacional de Bomberos de Colombia',
    acronym: 'DNBC',
    type: 'national',
    category: 'emergency',
    coverageDescription: 'Coordinación estratégica nacional de brigadas bomberiles y respuesta ante siniestros con materiales peligrosos.',
    emergencyHotline: 'Línea 119 / (601) 555 7940',
    directPhone: '(601) 555 7940',
    address: 'Carrera 13 # 27-00, Piso 7',
    city: 'Bogotá D.C.',
    coordinates: { lat: 4.6152, lng: -74.0718 },
    website: 'https://dnbc.gov.co',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution'],
    availableHours: '24 Horas'
  },
  {
    id: 'ungrd',
    name: 'Unidad Nacional para la Gestión del Riesgo de Desastres',
    acronym: 'UNGRD / HAZMAT',
    type: 'national',
    category: 'emergency',
    coverageDescription: 'Coordinación del Plan Nacional de Contingencia (PNC) ante derrames mayores en tierra y cuerpos fluviales.',
    emergencyHotline: '01 8000 111 123',
    directPhone: '(601) 555 0000',
    address: 'Avenida Calle 26 # 92-32, Edificio Gold 4',
    city: 'Bogotá D.C. / Sala de Crisis Nacional',
    coordinates: { lat: 4.6854, lng: -74.1189 },
    website: 'https://portal.gestiondelriesgo.gov.co',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'water_pollution', 'air_pollution'],
    availableHours: '24 Horas Sala de Crisis'
  },
  {
    id: 'defensa-civil',
    name: 'Defensa Civil Colombiana - Seccional Santander',
    acronym: 'DCC',
    type: 'regional',
    category: 'emergency',
    coverageDescription: 'Atención humanitaria de emergencias, búsqueda, rescate y apoyo en contención comunitaria de vertimientos.',
    emergencyHotline: 'Línea 144',
    directPhone: '(607) 645 2200',
    address: 'Calle 45 # 14-50',
    city: 'Bucaramanga / Operación Magdalena Medio',
    coordinates: { lat: 7.1085, lng: -73.1256 },
    website: 'https://www.defensacivil.gov.co',
    categoriesHandled: ['oil_spill', 'water_pollution', 'toxic_waste'],
    availableHours: '24 Horas / Central de Radio'
  },
  {
    id: 'cruz-roja',
    name: 'Cruz Roja Colombiana - Seccional Santander',
    acronym: 'CRUZ ROJA',
    type: 'regional',
    category: 'emergency',
    coverageDescription: 'Soporte de primeros auxilios a poblaciones ribereñas afectadas por intoxicaciones o contaminación de agua potable.',
    emergencyHotline: 'Línea 132',
    directPhone: '(607) 642 7575',
    address: 'Carrera 26 # 34-30',
    city: 'Bucaramanga, Santander',
    coordinates: { lat: 7.1215, lng: -73.1189 },
    website: 'https://cruzrojacolombiana.org',
    categoriesHandled: ['water_pollution', 'toxic_waste'],
    availableHours: '24 Horas'
  },

  // 3. Policía Nacional y Fuerzas de Seguridad
  {
    id: 'policia-ambiental',
    name: 'Policía Nacional - Grupo de Protección Ambiental y Ecológica',
    acronym: 'POLICÍA AMBIENTAL',
    type: 'national',
    category: 'police',
    coverageDescription: 'Investigación judicial de delitos contra los recursos naturales, tráfico de flora/fauna y tala ilegal no autorizada.',
    emergencyHotline: 'Línea 123 / Cuadrante Ambiental',
    directPhone: '350 340 3777',
    address: 'Comando de Policía del Magdalena Medio, Calle 50 # 17-20',
    city: 'Barrancabermeja, Santander',
    coordinates: { lat: 7.0674, lng: -73.8582 },
    website: 'https://www.policia.gov.co/ambiental',
    categoriesHandled: ['deforestation', 'oil_spill', 'toxic_waste', 'water_pollution'],
    availableHours: '24 Horas / Cuadrantes en Patrullaje'
  },
  {
    id: 'dijin-grate',
    name: 'Dirección de Carabineros y Protección Ambiental (DICAR - PONAL)',
    acronym: 'DICAR',
    type: 'national',
    category: 'police',
    coverageDescription: 'Operaciones tácticas contra minería ilegal con cianuro/mercurio y deforestación masiva en reservas forestales.',
    emergencyHotline: 'Línea 123 / 01 8000 910 112',
    directPhone: '(601) 515 9000',
    address: 'Transversal 45 # 40-20',
    city: 'Bogotá / Comandos Regionales',
    coordinates: { lat: 4.6391, lng: -74.0881 },
    website: 'https://www.policia.gov.co/carabineros',
    categoriesHandled: ['deforestation', 'toxic_waste', 'water_pollution'],
    availableHours: '24 Horas'
  },
  {
    id: 'fiscalia-decon',
    name: 'Fiscalía General de la Nación - Dirección Especializada contra Delitos Ambientales',
    acronym: 'FISCALÍA DECON',
    type: 'national',
    category: 'police',
    coverageDescription: 'Judicialización penal por contaminación ambiental dolosa, daño en los recursos naturales y apoderamiento de hidrocarburos.',
    emergencyHotline: 'Línea 122',
    directPhone: '01 8000 919 748',
    address: 'Diagonal 22B # 52-01',
    city: 'Bogotá / Seccional Magdalena Medio',
    coordinates: { lat: 4.6465, lng: -74.1082 },
    website: 'https://www.fiscalia.gov.co',
    categoriesHandled: ['oil_spill', 'deforestation', 'toxic_waste'],
    availableHours: '24 Horas recepción de denuncias penales'
  },

  // 4. Autoridad Marítima y Fluvial
  {
    id: 'dimar',
    name: 'Dirección General Marítima y Capitanía de Puerto',
    acronym: 'DIMAR',
    type: 'maritime',
    category: 'maritime',
    coverageDescription: 'Inspección de naves, barcazas cisterna, terminales portuarios y control de derrames en aguas marítimas y fluviales navegables.',
    emergencyHotline: 'Línea 146 Guardacostas',
    directPhone: '(605) 664 6133',
    address: 'Capitanía de Puerto de Barrancabermeja, Malecón del Río',
    city: 'Barrancabermeja / Cartagena / Buenaventura',
    coordinates: { lat: 7.0712, lng: -73.8654 },
    website: 'https://www.dimar.mil.co',
    categoriesHandled: ['oil_spill', 'water_pollution', 'toxic_waste'],
    availableHours: '24 Horas Estación Guardacostas'
  },

  // 5. Salud y Toxicología
  {
    id: 'minsalud-toxicologia',
    name: 'Línea Nacional de Información Toxicológica (Ministerio de Salud)',
    acronym: 'CISPROQUIM / TOXICOLOGÍA',
    type: 'emergency',
    category: 'health',
    coverageDescription: 'Asistencia médica inmediata ante intoxicación por inhalación de gases H2S, contacto con químicos y pesticidas.',
    emergencyHotline: '01 8000 916 012',
    directPhone: '(601) 288 6012',
    address: 'Carrera 13 # 32-76',
    city: 'Bogotá D.C. / Teleasistencia Nacional',
    coordinates: { lat: 4.6192, lng: -74.0702 },
    website: 'https://www.minsalud.gov.co',
    categoriesHandled: ['toxic_waste', 'oil_spill', 'air_pollution'],
    availableHours: '24 Horas Asesoría Médica Toxicológica'
  },
  {
    id: 'hospital-barranca',
    name: 'Hospital Regional del Magdalena Medio (Urgencias)',
    acronym: 'HRMM',
    type: 'regional',
    category: 'health',
    coverageDescription: 'Centro hospitalario de tercer nivel para atención de trabajadores y civiles afectados en siniestros químicos.',
    emergencyHotline: 'Línea 125 / (607) 622 3444',
    directPhone: '(607) 622 3444',
    address: 'Calle 52 # 15-20',
    city: 'Barrancabermeja, Santander',
    coordinates: { lat: 7.0691, lng: -73.8512 },
    website: 'https://hrmm.gov.co',
    categoriesHandled: ['toxic_waste', 'air_pollution'],
    availableHours: '24 Horas Servicio de Urgencias'
  },

  // 6. Entidades de Cobertura Nacional y Regionales Adicionales (Antioquia, Valle, Caribe, Eje Cafetero, Amazonía, Orinoquía, Pacífico)
  {
    id: 'bomberos-medellin',
    name: 'Cuerpo Oficial de Bomberos de Medellín - Estación Libertadores',
    acronym: 'BOMBEROS MEDELLÍN',
    type: 'emergency',
    category: 'emergency',
    coverageDescription: 'Atención técnica de contingencias industriales, control de fugas de hidrocarburos e incidentes con materiales peligrosos en el Valle de Aburrá.',
    emergencyHotline: 'Línea 119 / 123',
    directPhone: '(604) 385 5555',
    address: 'Calle 44 # 52-165, Centro Administrativo La Alpujarra',
    city: 'Medellín, Antioquia',
    coordinates: { lat: 6.2442, lng: -75.5748 },
    website: 'https://www.medellin.gov.co',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution'],
    availableHours: '24 Horas / Guardia Permanente'
  },
  {
    id: 'corantioquia',
    name: 'Corporación Autónoma Regional del Centro de Antioquia',
    acronym: 'CORANTIOQUIA',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Gestión y control ambiental sobre 80 municipios de Antioquia en las cuencas del Río Cauca y Magdalena.',
    emergencyHotline: '01 8000 412 230',
    directPhone: '(604) 493 8888',
    address: 'Carrera 65 # 44A-32',
    city: 'Medellín, Antioquia',
    coordinates: { lat: 6.2519, lng: -75.5878 },
    website: 'https://www.corantioquia.gov.co',
    categoriesHandled: ['oil_spill', 'deforestation', 'water_pollution', 'toxic_waste'],
    availableHours: 'Lunes a Viernes 7:30 AM - 4:30 PM (Línea verde 24/7)'
  },
  {
    id: 'bomberos-cali',
    name: 'Benemérito Cuerpo de Bomberos Voluntarios de Cali',
    acronym: 'BOMBEROS CALI',
    type: 'emergency',
    category: 'emergency',
    coverageDescription: 'Unidad de Rescate HAZMAT para atención de derrames químicos e incendios industriales en el suroccidente colombiano.',
    emergencyHotline: 'Línea 119',
    directPhone: '(602) 660 5555',
    address: 'Calle 34 Norte # 2AN-30',
    city: 'Cali, Valle del Cauca',
    coordinates: { lat: 3.4682, lng: -76.5225 },
    website: 'https://bomberoscali.org',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution'],
    availableHours: '24 Horas'
  },
  {
    id: 'cvc',
    name: 'Corporación Autónoma Regional del Valle del Cauca',
    acronym: 'CVC',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Monitoreo de calidad hídrica de la cuenca alta y media del Río Cauca y ecosistemas del Pacífico vallecaucano.',
    emergencyHotline: '01 8000 933 044',
    directPhone: '(602) 620 6600',
    address: 'Carrera 56 # 11-36',
    city: 'Cali, Valle del Cauca',
    coordinates: { lat: 3.4116, lng: -76.5387 },
    website: 'https://www.cvc.gov.co',
    categoriesHandled: ['water_pollution', 'deforestation', 'oil_spill', 'toxic_waste'],
    availableHours: '24 Horas atención de emergencias ambientales'
  },
  {
    id: 'bomberos-barranquilla',
    name: 'Cuerpo de Bomberos del Distrito Especial de Barranquilla',
    acronym: 'BOMBEROS BARRANQUILLA',
    type: 'emergency',
    category: 'emergency',
    coverageDescription: 'Respuesta ante emergencias con combustibles en el corredor portuario e industrial del Río Magdalena.',
    emergencyHotline: 'Línea 119',
    directPhone: '(605) 379 3333',
    address: 'Carrera 38 # 54-47',
    city: 'Barranquilla, Atlántico',
    coordinates: { lat: 10.9878, lng: -74.7889 },
    website: 'https://www.barranquilla.gov.co',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution'],
    availableHours: '24 Horas'
  },
  {
    id: 'cra',
    name: 'Corporación Autónoma Regional del Atlántico',
    acronym: 'CRA',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Protección ambiental costera, ciénagas del Caribe y desembocadura del Río Magdalena (Bocas de Ceniza).',
    emergencyHotline: '01 8000 110 102',
    directPhone: '(605) 349 2482',
    address: 'Calle 66 # 54-43',
    city: 'Barranquilla, Atlántico',
    coordinates: { lat: 10.9985, lng: -74.8012 },
    website: 'https://crautonoma.gov.co',
    categoriesHandled: ['water_pollution', 'toxic_waste', 'oil_spill'],
    availableHours: 'Lunes a Viernes 8:00 AM - 5:00 PM'
  },
  {
    id: 'dimar-cartagena',
    name: 'DIMAR - Capitanía de Puerto de Cartagena',
    acronym: 'DIMAR CARTAGENA',
    type: 'maritime',
    category: 'maritime',
    coverageDescription: 'Inspección de terminales petroleros en la Bahía de Cartagena y atención a contingencias marinas del Caribe colombiano.',
    emergencyHotline: 'Línea 146 / VHF Canal 16',
    directPhone: '(605) 669 4141',
    address: 'Barrio Manga, 3a Avenida # 21-125',
    city: 'Cartagena, Bolívar',
    coordinates: { lat: 10.4089, lng: -75.5398 },
    website: 'https://www.dimar.mil.co',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'water_pollution'],
    availableHours: '24 Horas Estación de Control de Tráfico Marítimo'
  },
  {
    id: 'cardique',
    name: 'Corporación Autónoma Regional del Canal del Dique',
    acronym: 'CARDIQUE',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Control ambiental en la cuenca del Canal del Dique, bahía de Cartagena y litoral norte de Bolívar.',
    emergencyHotline: '01 8000 918 300',
    directPhone: '(605) 669 4444',
    address: 'Sector Ronda Real, Torre Empresarial Piso 6',
    city: 'Cartagena, Bolívar',
    coordinates: { lat: 10.3997, lng: -75.4851 },
    website: 'https://cardique.gov.co',
    categoriesHandled: ['water_pollution', 'oil_spill', 'deforestation'],
    availableHours: 'Lunes a Viernes 7:30 AM - 4:30 PM'
  },
  {
    id: 'dimar-buenaventura',
    name: 'DIMAR - Capitanía de Puerto de Buenaventura',
    acronym: 'DIMAR BUENAVENTURA',
    type: 'maritime',
    category: 'maritime',
    coverageDescription: 'Supervisión marítima, prevención de vertimientos y control de hidrocarburos en el litoral Pacífico colombiano.',
    emergencyHotline: 'Línea 146 Guardacostas',
    directPhone: '(602) 242 3400',
    address: 'Terminal Marítimo, Avenida Portuaria',
    city: 'Buenaventura, Valle del Cauca',
    coordinates: { lat: 3.8833, lng: -77.0333 },
    website: 'https://www.dimar.mil.co',
    categoriesHandled: ['oil_spill', 'water_pollution', 'toxic_waste'],
    availableHours: '24 Horas'
  },
  {
    id: 'cormacarena',
    name: 'Corporación para el Desarrollo Sostenible del Área Especial La Macarena',
    acronym: 'CORMACARENA',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Vigilancia de oleoductos y pozos en los Llanos Orientales, cuenca del Río Meta y serranía de la Macarena.',
    emergencyHotline: '01 8000 117 177',
    directPhone: '(608) 673 0420',
    address: 'Carrera 35 # 25-57, Barrio San Benito',
    city: 'Villavicencio, Meta',
    coordinates: { lat: 4.1420, lng: -73.6266 },
    website: 'https://cormacarena.gov.co',
    categoriesHandled: ['oil_spill', 'deforestation', 'water_pollution'],
    availableHours: 'Lunes a Viernes 8:00 AM - 5:00 PM (Línea SOS 24/7)'
  },
  {
    id: 'bomberos-cucuta',
    name: 'Cuerpo de Bomberos Voluntarios de Cúcuta',
    acronym: 'BOMBEROS CÚCUTA',
    type: 'emergency',
    category: 'emergency',
    coverageDescription: 'Atención de emergencias químicas y protección de cuencas en zona de frontera y corredor del Catatumbo.',
    emergencyHotline: 'Línea 119',
    directPhone: '(607) 578 0088',
    address: 'Avenida 1 # 18-45, Barrio Blanco',
    city: 'Cúcuta, Norte de Santander',
    coordinates: { lat: 7.8939, lng: -72.5078 },
    website: 'https://bomberoscucuta.com',
    categoriesHandled: ['oil_spill', 'toxic_waste', 'air_pollution'],
    availableHours: '24 Horas'
  },
  {
    id: 'corponor',
    name: 'Corporación Autónoma Regional de la Frontera Nororiental',
    acronym: 'CORPONOR',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Monitoreo de atentados y derrames sobre el Oleoducto Caño Limón-Coveñas en la cuenca binacional del Catatumbo.',
    emergencyHotline: '01 8000 111 818',
    directPhone: '(607) 582 8484',
    address: 'Calle 13 # 3E-278, Barrio Caobos',
    city: 'Cúcuta, Norte de Santander',
    coordinates: { lat: 7.8892, lng: -72.4965 },
    website: 'https://corponor.gov.co',
    categoriesHandled: ['oil_spill', 'water_pollution', 'deforestation'],
    availableHours: '24 Horas Sala de Crisis Ambiental'
  },
  {
    id: 'corpoamazonia',
    name: 'Corporación para el Desarrollo Sostenible del Sur de la Amazonia',
    acronym: 'CORPOAMAZONIA',
    type: 'regional',
    category: 'environmental',
    coverageDescription: 'Supervisión ambiental de pozos petroleros en Orito, Puerto Asís y cuencas amazónicas del Putumayo y Caquetá.',
    emergencyHotline: '01 8000 918 303',
    directPhone: '(608) 429 6641',
    address: 'Carrera 6 # 2-30',
    city: 'Mocoa, Putumayo',
    coordinates: { lat: 1.1492, lng: -76.6508 },
    website: 'https://www.corpoamazonia.gov.co',
    categoriesHandled: ['oil_spill', 'deforestation', 'water_pollution'],
    availableHours: 'Lunes a Viernes 7:30 AM - 5:00 PM'
  },
  {
    id: 'hospital-san-vicente',
    name: 'Hospital Universitario San Vicente Fundación (Centro Toxicológico)',
    acronym: 'HOSPITAL SAN VICENTE',
    type: 'regional',
    category: 'health',
    coverageDescription: 'Centro de referencia toxicológica para el noroccidente de Colombia y tratamiento intensivo por exposición química.',
    emergencyHotline: '01 8000 448 100',
    directPhone: '(604) 444 1333',
    address: 'Calle 64 # 51D-154',
    city: 'Medellín, Antioquia',
    coordinates: { lat: 6.2625, lng: -75.5672 },
    website: 'https://sanvicentefundacion.com',
    categoriesHandled: ['toxic_waste', 'air_pollution'],
    availableHours: '24 Horas Central de Toxicología y Urgencias'
  },
  {
    id: 'policia-metropolitana-cali',
    name: 'Policía Metropolitana de Cali - Seccional de Protección Ambiental',
    acronym: 'MEVAL - POLICÍA AMBIENTAL',
    type: 'regional',
    category: 'police',
    coverageDescription: 'Operativos contra vertimientos contaminantes ilegales en el Río Cauca y minería en los Farallones de Cali.',
    emergencyHotline: 'Línea 123',
    directPhone: '(602) 882 6100',
    address: 'Carrera 1 # 21-97',
    city: 'Cali, Valle del Cauca',
    coordinates: { lat: 3.4533, lng: -76.5192 },
    website: 'https://www.policia.gov.co',
    categoriesHandled: ['water_pollution', 'toxic_waste', 'deforestation'],
    availableHours: '24 Horas'
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
    criticalNotice: 'Activa protocolo inmediato de barreras de contención y skimmers con ANLA, Bomberos y UNGRD.'
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
    criticalNotice: 'Despacha patrullaje conjunto con Policía Ambiental (DICAR) y guardabosques de Parques Nacionales.'
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
    criticalNotice: 'Alerta a acueductos municipales aguas abajo para cierre preventivo de bocatomas y toma pericial.'
  },
  toxic_waste: {
    label: 'Residuos Peligrosos y Químicos',
    shortLabel: 'Residuos Tóxicos',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#a855f7',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    iconName: 'AlertTriangle',
    description: 'Disposición ilegal de canecas, lodos químicos, agroquímicos vencidos, metales pesados o baterías industriales.',
    criticalNotice: 'Requiere cuadrillas HAZMAT certificadas con trajes nivel B/A para evitar intoxicación dérmica o respiratoria.'
  },
  air_pollution: {
    label: 'Emisiones Atmosféricas y Quemas',
    shortLabel: 'Emisiones / Humo',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: '#ec4899',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    iconName: 'Wind',
    description: 'Venteo no controlado de gas amargo (H2S), incendios de cobertura vegetal a gran escala o emanaciones irritantes.',
    criticalNotice: 'Determinar radio de evacuación perimetral a favor del viento según concentraciones ppm registradas.'
  }
};

export const ACTION_PROTOCOLS: ActionProtocol[] = [
  {
    id: 'prot-oil',
    category: 'oil_spill',
    title: 'Protocolo de Contención Primaria y Respuesta ante Derrames de Hidrocarburos',
    shortTitle: 'Derrame de Hidrocarburos (Crudo / Nafta)',
    framework: 'Decreto 321 de 1999 (Plan Nacional de Contingencia) • Resolución 1209 de 2018',
    objective: 'Interrumpir el avance de la mancha de hidrocarburo hacia fuentes hídricas superficiales, humedales y bocatomas mediante barreras oleofílicas, diques de contención y recuperación mecánica.',
    activationCode: 'CÓDIGO ROJO - PNC HIDROCARBUROS NIVEL 1 / 2',
    severityFocus: ['critical', 'high'],
    emergencyContacts: [
      'Línea 119 - Bomberos HAZMAT Barrancabermeja',
      '01 8000 112 998 - Sala de Crisis ANLA',
      'Línea 146 - Guardacostas DIMAR (Zonas navegables)',
      '01 8000 111 123 - Centro de Operaciones UNGRD'
    ],
    equipmentNeeded: [
      'Barreras oleofílicas absorbentes (Rollos de 10 y 20 pies)',
      'Barreras de confinamiento flotante tipo cortina para ríos',
      'Skimmers o desnatadores de disco y tambor con bomba de succión',
      'Tanques cisterna portátiles Fastank de 10.000 litros',
      'EPP Nivel C: Botas de nitrilo, trajes Tychem, máscaras con filtro vapores orgánicos'
    ],
    containmentChecklist: [
      'Establecer zona de exclusión de 500 metros en la dirección del viento (Hot Zone).',
      'Prohibir tajantemente encender vehículos, generadores o fósforos por presencia de gases explosivos.',
      'Identificar la fuente: estrangular válvula de corte del oleoducto o taponar fisura.',
      'Anclar barreras de contención aguas abajo en ángulo de 45° respecto al curso de la corriente.',
      'Avisar por radio y telefonía a bocatomas de acueductos aguas abajo para suspender captación.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Evaluación y Aseguramiento del Perímetro',
        description: 'Verificar la ausencia de fuentes de ignición. Medir con explosímetro (LEL) y monitor multigas (H2S, CO, O2). Establecer el puesto de mando unificado (PMU).',
        criticalWarning: 'Si la concentración de LEL supera el 10%, evacuar el personal inmediatamente en sentido perpendicular al viento.',
        responsibleRole: 'Líder Comunitario / Comandante de Incidente HAZMAT'
      },
      {
        stepNumber: 2,
        title: 'Alerta Preventiva a Bocatomas y Poblaciones Aguas Abajo',
        description: 'Notificar de inmediato a las empresas de acueducto municipal y consejos comunitarios ribereños para cerrar bocatomas de acueducto antes de que arribe la pluma del derrame.',
        responsibleRole: 'Despacho de Emergencias / Autoridad Ambiental CAS / ANLA'
      },
      {
        stepNumber: 3,
        title: 'Despliegue de Barreras Flotantes y Recuperación Mecánica',
        description: 'Tender barreras de confinamiento flotante en tramos de bajo flujo hidrodinámico. Disponer skimmers para aspiración del hidrocarburo retenido hacia camiones de vacío (Vactor).',
        criticalWarning: 'Nunca aplicar dispersantes químicos en ríos o ciénagas dulces sin autorización expresa del Ministerio de Ambiente.',
        responsibleRole: 'Brigada HAZMAT / Ecopetrol / Contratista Especializado'
      },
      {
        stepNumber: 4,
        title: 'Disposición de Suelos y Biomasa Contaminada',
        description: 'Embalar el material absorbente impregnado en geomembranas selladas y etiquetadas como residuos peligrosos RESPEL para tratamiento por biorremediación o incineración térmica autorizada.',
        responsibleRole: 'Gestor Ambiental Certificado ANLA'
      }
    ]
  },
  {
    id: 'prot-deforest',
    category: 'deforestation',
    title: 'Protocolo de Acción Rápida contra Deforestación, Tala Ilegal e Incendios Forestales',
    shortTitle: 'Deforestación & Tala No Autorizada',
    framework: 'Ley 2111 de 2021 (Delitos Ambientales) • Ley 99 de 1993 • Código Penal Art. 328',
    objective: 'Documentar, georreferenciar y coordinar la intervención policial y judicial oportuna ante frentes activos de tala rasa, quema de reserva natural o usurpación de baldíos protegidos.',
    activationCode: 'CÓDIGO VERDE - DELITO CONTRA LA BIODIVERSIDAD',
    severityFocus: ['critical', 'high', 'medium'],
    emergencyContacts: [
      'Línea 123 / 350 340 3777 - Policía Nacional Protección Ambiental',
      '01 8000 912 607 - Parques Nacionales Naturales',
      'Línea 122 - Fiscalía Especializada Delitos Ambientales (DECON)',
      '01 8000 915 303 - Corporación Autónoma Regional CAS'
    ],
    equipmentNeeded: [
      'Dispositivo GPS o App EcoAlerta para levantamiento de polígonos',
      'Cámara fotográfica de alta resolución con geolocalización activa',
      'Dron de reconocimiento aéreo para evaluación de biomasa talada',
      'Cartografía satelital catastral y de zonas de reserva forestal'
    ],
    containmentChecklist: [
      'No confrontar a cuadrillas de aserradores ilegales que puedan portar armas de fuego.',
      'Tomar fotos panorámicas y puntos de referencia visibles (cerros, ríos, trochas).',
      'Registrar huellas de maquinaria pesada, motosierras, camiones o campamentos clandestinos.',
      'Cargar el reporte georreferenciado en EcoAlerta para notificación directa a DICAR y Fiscalía.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Detección Silenciosa y Levantamiento de Coordenadas',
        description: 'Registrar los vértices del área afectada sin ingresar al radio de riesgo del personal talador. Determinar si existe humo activo o quemas controladas que puedan derivar en incendios forestales.',
        criticalWarning: 'Mantener estricto protocolo de protección a líderes ambientales y defensores del territorio.',
        responsibleRole: 'Comunidad / Guardaparques / Veeduría Ciudadana'
      },
      {
        stepNumber: 2,
        title: 'Verificación de Licenciamiento en Ventanilla Única',
        description: 'Consultar el catastro ambiental para comprobar si existe aprovechamiento forestal autorizado o si se trata de área de reserva forestal de Ley 2da de 1959 o PNN.',
        responsibleRole: 'Técnico de la Corporación Autónoma Regional (CAR)'
      },
      {
        stepNumber: 3,
        title: 'Intervención Policial y Decomiso Preventivo',
        description: 'Despacho de patrulla de Policía Ambiental y Carabineros para incautar motosierras, trozas de madera y paralizar maquinaria pesada amparados en la Ley de Delitos Ambientales.',
        responsibleRole: 'Policía Nacional / Armada Nacional / Fiscalía DECON'
      },
      {
        stepNumber: 4,
        title: 'Diseño del Plan de Restauración Ecológica',
        description: 'Peritaje biológico para estimar el daño a la fauna nativa, pérdida de cobertura de dosel y establecimiento de compromisos de siembra con especies nativas pioneras.',
        responsibleRole: 'Biólogos CAR / Jardines Botánicos / Comunidad'
      }
    ]
  },
  {
    id: 'prot-water',
    category: 'water_pollution',
    title: 'Protocolo de Emergencia Toxicológica y Limnológica en Cuerpos Hídricos',
    shortTitle: 'Vertimientos Tóxicos y Mortandad Íctica',
    framework: 'Decreto 1076 de 2015 • Resolución 0631 de 2015 (Parámetros de Vertimientos)',
    objective: 'Aislar fuentes de agua potable en riesgo, identificar el agente contaminante (químico, minero, agroindustrial) y preservar cadena de custodia de muestras para sanción ambiental.',
    activationCode: 'CÓDIGO AZUL - CONTAMINACIÓN DE ACUÍFEROS Y RÍOS',
    severityFocus: ['critical', 'high'],
    emergencyContacts: [
      'Línea 119 - Bomberos Inspección Acuática',
      '01 8000 916 012 - Centro de Información Toxicológica (CISPROQUIM)',
      'Línea 125 - Centro Regulador de Urgencias y Emergencias de Salud',
      '01 8000 915 303 - Laboratorio de Calidad del Agua CAS'
    ],
    equipmentNeeded: [
      'Frascos de vidrio ámbar esterilizados y sellados para toma de muestras',
      'Nevera portátil con hielo seco a 4°C para preservación de muestras',
      'Sonda multiparamétrica (pH, Oxígeno Disuelto, Conductividad, Temperatura)',
      'Cintas de señalización de peligro y vallas de prohibición de baño/pesca'
    ],
    containmentChecklist: [
      'Suspender el consumo humano de agua y abrevar animales de pastoreo de forma preventiva.',
      'Prohibir la comercialización y consumo de peces muertos o moribundos flotantes.',
      'Avisar a pescadores artesanales para no utilizar redes en el tramo crítico.',
      'Monitorear cambios de coloración (lechoso, azulado, aceitoso) o emanación de olores sulfurosos.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Cierre Preventivo de Bocatomas y Alerta Sanitaria',
        description: 'Comunicación radial inmediata con empresas operadoras de acueducto y juntas de acción comunal para suspender bombeo de agua cruda hacia tanques de tratamiento.',
        criticalWarning: 'El hervido del agua NO elimina metales pesados (cianuro, mercurio o arsénico); al contrario, puede concentrarlos.',
        responsibleRole: 'Secretaría de Salud Municipal / Operadores de Acueducto'
      },
      {
        stepNumber: 2,
        title: 'Muestreo Técnico con Cadena de Custodia',
        description: 'Tomar muestras de agua superficial, fondo y sedimentos: aguas arriba del vertimiento (blanco), en el punto de descarga y aguas abajo en la zona de mezcla.',
        responsibleRole: 'Laboratorio Acreditado IDEAM / Técnicos CAR'
      },
      {
        stepNumber: 3,
        title: 'Suministro Alterno de Agua Potable por Carrotanques',
        description: 'Activar el Consejo Municipal de Gestión del Riesgo para coordinar la distribución de agua potable tratada en carrotanques de Bomberos y Defensa Civil a las comunidades afectadas.',
        responsibleRole: 'Alcaldía Municipal / Defensa Civil / Cruz Roja'
      },
      {
        stepNumber: 4,
        title: 'Neutralización o Dilución Controlada',
        description: 'Dependiendo del compuesto (ácidos, bases o materia orgánica), dosificar agentes neutralizantes bajo estricta supervisión de ingenieros químicos del SINA.',
        responsibleRole: 'Comité Técnico de Manejo de Desastres / UNGRD'
      }
    ]
  },
  {
    id: 'prot-toxic',
    category: 'toxic_waste',
    title: 'Protocolo de Aislamiento y Neutralización de Residuos Químicos y Peligrosos (HAZMAT)',
    shortTitle: 'Residuos Peligrosos & Químicos',
    framework: 'Ley 1252 de 2008 (Residuos Peligrosos) • Guía de Respuesta a Emergencias GRE',
    objective: 'Contener emanaciones de gases tóxicos, derrames de reactivos concentrados y prevenir la infiltración en suelos agrícolas mediante técnicas de confinamiento y neutralización.',
    activationCode: 'CÓDIGO PÚRPURA - MATERIALES PELIGROSOS CLASE 6 Y 8',
    severityFocus: ['critical', 'high'],
    emergencyContacts: [
      'Línea 119 - Brigada Especializada HAZMAT Bomberos',
      '01 8000 916 012 - CISPROQUIM (Asesoría Química 24 Horas)',
      'Línea 123 - Policía Nacional / Cuadrante de Vigilancia',
      '01 8000 112 998 - ANLA Seguimiento Ambiental'
    ],
    equipmentNeeded: [
      'Trajes de protección química encapsulados Nivel A y B',
      'Material absorbente inerte (Vermiculita, arena de diatomeas, polímeros)',
      'Tanques de sobreembalaje para canecas perforadas',
      'Neutralizantes ácidos/básicos (Cal viva, bicarbonato de sodio)',
      'Detectores fotométricos de gases tóxicos en tiempo real'
    ],
    containmentChecklist: [
      'Aproximarse siempre con el viento a favor (a la espalda).',
      'No tocar recipientes volcados ni caminar sobre charcos de sustancia desconocida.',
      'Revisar si los tambores exhiben rombos NFPA 704 o etiquetas DOT de Naciones Unidas.',
      'Mantener a curiosos y transeúntes a un mínimo de 300 metros a la redonda.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Identificación de la Sustancia mediante Guía GRE',
        description: 'Buscar el número UN de cuatro dígitos en los rótulos de los contenedores o placas de vehículos. Si no es visible, consultar inmediatamente con CISPROQUIM describiendo color, olor y estado físico.',
        criticalWarning: 'Jamás aplicar agua a recipientes que contengan sodio, potasio, fósforo blanco o ácidos concentrados porque provocan reacciones explosivas.',
        responsibleRole: 'Técnico Especialista HAZMAT / Primer Respondedor'
      },
      {
        stepNumber: 2,
        title: 'Dique Perimetral de Contención en Suelo Seco',
        description: 'Construir un cordón de tierra o arena con pala manual para confinar el líquido y evitar que alcance alcantarillados, cunetas o acequias de riego.',
        responsibleRole: 'Cuadrilla de Bomberos / Brigadistas de Emergencia'
      },
      {
        stepNumber: 3,
        title: 'Sobreembalaje y Trasvase Seguro',
        description: 'Colocar canecas fracturadas dentro de tambores de salvamento de polietileno de alta densidad (HDPE) sellados herméticamente.',
        responsibleRole: 'Empresa Certificada en Transporte de Carga Peligrosa'
      },
      {
        stepNumber: 4,
        title: 'Descontaminación de Personal y Herramientas',
        description: 'Establecer estación de descontaminación de 3 pasos (lavado con solución detergente, enjuague y retiro asistido de trajes) antes de salir de la zona tibia.',
        responsibleRole: 'Oficial de Seguridad HAZMAT'
      }
    ]
  }
];

export const DIRECTORY_CATEGORIES = [
  { id: 'all', label: 'Todas las Entidades', icon: 'Building2', count: ENVIRONMENTAL_AUTHORITIES.length },
  { id: 'emergency', label: 'Bomberos & Socorro (HAZMAT)', icon: 'Flame', count: ENVIRONMENTAL_AUTHORITIES.filter(a => a.category === 'emergency').length },
  { id: 'police', label: 'Policía & Seguridad Ambiental', icon: 'Shield', count: ENVIRONMENTAL_AUTHORITIES.filter(a => a.category === 'police').length },
  { id: 'environmental', label: 'Autoridades Ambientales (CAR/ANLA)', icon: 'TreePine', count: ENVIRONMENTAL_AUTHORITIES.filter(a => a.category === 'environmental').length },
  { id: 'maritime', label: 'Armada & Guardacostas (DIMAR)', icon: 'Anchor', count: ENVIRONMENTAL_AUTHORITIES.filter(a => a.category === 'maritime').length },
  { id: 'health', label: 'Salud & Toxicología', icon: 'HeartPulse', count: ENVIRONMENTAL_AUTHORITIES.filter(a => a.category === 'health').length },
] as const;
