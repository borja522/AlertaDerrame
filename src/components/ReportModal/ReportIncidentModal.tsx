import React, { useState } from 'react';
import { Incident, IncidentCategory, IncidentSeverity } from '../../types';
import { CATEGORY_METADATA, getAuthorityForCategory } from '../../data/authorities';
import { 
  AlertTriangle, 
  Camera, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Crosshair, 
  Droplet, 
  Flame, 
  Image as ImageIcon, 
  Locate, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Sparkles, 
  Trash2, 
  TreePine, 
  Upload, 
  Waves, 
  Wind, 
  X 
} from 'lucide-react';
import { playEmergencySirenSound, playSuccessChime } from '../../utils/audio';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIncident: (newIncident: Incident) => void;
  currentMapCoords?: { lat: number; lng: number };
  onStartMapPick?: () => void;
  pickedCoords?: { lat: number; lng: number } | null;
}

// Photographic evidence item definition
export interface EvidenceCatalogItem {
  id: string;
  url: string;
  title: string;
  description: string;
}

// Complete photographic evidence catalog per category with explicit descriptions
export const CATEGORY_EVIDENCE_CATALOG: Record<IncidentCategory, EvidenceCatalogItem[]> = {
  oil_spill: [
    {
      id: 'oil-1',
      url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
      title: 'Mancha de crudo sobre agua',
      description: 'Película oleosa negra e iridiscente expandida en superficie fluvial'
    },
    {
      id: 'oil-2',
      url: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=800&q=80',
      title: 'Fuga de tubería / hidrocarburo en suelo',
      description: 'Saturación espesa de crudo en vegetación y lodo'
    },
    {
      id: 'oil-3',
      url: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=800&q=80',
      title: 'Barrera de contención flotante',
      description: 'Cordón oleofílico absorbente intentando frenar el avance aguas abajo'
    },
    {
      id: 'oil-4',
      url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      title: 'Sedimento negro en la ribera',
      description: 'Acumulación de alquitrán y crudo en la orilla afectando fauna'
    }
  ],
  deforestation: [
    {
      id: 'def-1',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      title: 'Tala masiva y troncos cortados',
      description: 'Árboles nativos derribados con motosierra apilados para transporte'
    },
    {
      id: 'def-2',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
      title: 'Claro abierto en reserva forestal',
      description: 'Destrucción de cobertura vegetal para expansión agropecuaria'
    },
    {
      id: 'def-3',
      url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
      title: 'Trocha y maquinaria pesada',
      description: 'Bulldozers abriendo caminos no autorizados en selva protegida'
    },
    {
      id: 'def-4',
      url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
      title: 'Sotobosque arrasado',
      description: 'Pérdida de biodiversidad y degradación severa del suelo forestal'
    }
  ],
  water_pollution: [
    {
      id: 'wat-1',
      url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
      title: 'Vertimiento industrial turbio',
      description: 'Descarga no tratada cambiando la coloración natural de la fuente hídrica'
    },
    {
      id: 'wat-2',
      url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      title: 'Espuma química en ciénaga',
      description: 'Formación densa blanquecina por surfactantes y detergentes industriales'
    },
    {
      id: 'wat-3',
      url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
      title: 'Agua estancada con toxicidad',
      description: 'Alteración de oxígeno disuelto con riesgo para consumo humano y peces'
    },
    {
      id: 'wat-4',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      title: 'Lixiviados y residuos en caño',
      description: 'Filtración de contaminantes líquidos directamente al lecho del río'
    }
  ],
  toxic_waste: [
    {
      id: 'tox-1',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      title: 'Canecas industriales de 55 galones',
      description: 'Tambores metálicos corroídos con solventes y residuos químicos'
    },
    {
      id: 'tox-2',
      url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
      title: 'Botadero clandestino a cielo abierto',
      description: 'Disposición ilegal de materiales inflamables y corrosivos sin control'
    },
    {
      id: 'tox-3',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      title: 'Lodos y desechos peligrosos',
      description: 'Material viscoso residual abandonado sobre suelo permeable'
    },
    {
      id: 'tox-4',
      url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80',
      title: 'Contenedores oxidados abandonados',
      description: 'Recipientes químicos expuestos a la intemperie en zona rural'
    }
  ],
  air_pollution: [
    {
      id: 'air-1',
      url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
      title: 'Emisiones de chimenea industrial',
      description: 'Expulsión continua de humo oscuro con partículas tóxicas'
    },
    {
      id: 'air-2',
      url: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80',
      title: 'Incendio forestal y nube de humo',
      description: 'Frente de fuego no controlado saturando la atmósfera de gases'
    },
    {
      id: 'air-3',
      url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      title: 'Esmog denso sobre el territorio',
      description: 'Concentración crítica de material particulado afectando la respiración'
    },
    {
      id: 'air-4',
      url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
      title: 'Quema clandestina de residuos',
      description: 'Combustión al aire libre de plásticos y materiales con gases tóxicos'
    }
  ]
};

// Helper function to extract metadata for any photo url
const findPhotoDetails = (url: string) => {
  for (const cat of Object.keys(CATEGORY_EVIDENCE_CATALOG) as IncidentCategory[]) {
    const item = CATEGORY_EVIDENCE_CATALOG[cat].find((p) => p.url === url);
    if (item) return item;
  }
  return {
    id: 'custom',
    url,
    title: 'Fotografía Anexada',
    description: 'Documentación gráfica aportada en el reporte'
  };
};

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmitIncident,
  currentMapCoords,
  onStartMapPick,
  pickedCoords
}) => {
  // Wizard step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [category, setCategory] = useState<IncidentCategory>('oil_spill');
  const [severity, setSeverity] = useState<IncidentSeverity>('critical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>(
    CATEGORY_EVIDENCE_CATALOG.oil_spill.map((p) => p.url)
  );
  const [lat, setLat] = useState<number>(pickedCoords?.lat || currentMapCoords?.lat || 7.0651);
  const [lng, setLng] = useState<number>(pickedCoords?.lng || currentMapCoords?.lng || -73.7915);
  const [address, setAddress] = useState('Sector Ribereño Km 12');
  const [municipality, setMunicipality] = useState('Barrancabermeja');
  const [department, setDepartment] = useState('Santander');
  const [affectedRadiusMeters, setAffectedRadiusMeters] = useState<number>(1500);

  // Impact
  const [waterSourcesAffected, setWaterSourcesAffected] = useState(true);
  const [floraFaunaRisk, setFloraFaunaRisk] = useState(true);
  const [populationAtRisk, setPopulationAtRisk] = useState(850);
  const [estimatedAreaOrVol, setEstimatedAreaOrVol] = useState('');

  // Reporter
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('Veeduría Ambiental Comunitaria');
  const [reporterPhone, setReporterPhone] = useState('+57 311 000 0000');

  const [isLocating, setIsLocating] = useState(false);

  // Auto-sync all 4 photos with category when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhotos(CATEGORY_EVIDENCE_CATALOG[category].map((p) => p.url));
    }
  }, [isOpen, category]);

  // Sync picked coordinates when changed from parent
  React.useEffect(() => {
    if (pickedCoords) {
      setLat(pickedCoords.lat);
      setLng(pickedCoords.lng);
    }
  }, [pickedCoords]);

  if (!isOpen) return null;

  const authority = getAuthorityForCategory(category);
  const activeMeta = CATEGORY_METADATA[category];

  // Category change handler that auto-assigns all matching evidence photos
  const handleSelectCategory = (newCategory: IncidentCategory) => {
    setCategory(newCategory);
    setPhotos(CATEGORY_EVIDENCE_CATALOG[newCategory].map((p) => p.url));
  };

  const handleProceedToStep2 = () => {
    if (photos.length === 0) {
      setPhotos(CATEGORY_EVIDENCE_CATALOG[category].map((p) => p.url));
    }
    setStep(2);
  };

  // Toggle or add photo from catalog
  const toggleCatalogPhoto = (url: string) => {
    if (photos.includes(url)) {
      setPhotos(photos.filter((p) => p !== url));
    } else {
      setPhotos([...photos, url]);
    }
  };

  const handleAddSamplePhotos = () => {
    const samples = CATEGORY_EVIDENCE_CATALOG[category].map((p) => p.url);
    setPhotos(samples);
  };

  // Geolocation trigger
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no cuenta con soporte de geolocalización.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      (_err) => {
        setIsLocating(false);
        alert('No se pudo acceder a la ubicación GPS. Puedes ingresar las coordenadas manualmente o fijar en el mapa.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPhotos((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sound alert
    if (severity === 'critical') {
      playEmergencySirenSound();
    } else {
      playSuccessChime();
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newFolio = `AMB-${new Date().getFullYear()}-${randomSuffix}`;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      folioNumber: newFolio,
      title: title.trim() || `${activeMeta.label} en ${municipality}`,
      category,
      severity,
      status: 'reported',
      description: description.trim() || 'Reporte de emergencia emitido por la comunidad para intervención y contención ambiental inmediata.',
      location: {
        lat: Number(lat),
        lng: Number(lng),
        address: address.trim() || 'Sector georreferenciado',
        municipality: municipality.trim() || 'Barrancabermeja',
        department: department.trim() || 'Santander',
        accuracyMeters: 10
      },
      affectedRadiusMeters: Number(affectedRadiusMeters),
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80'],
      createdAt: new Date().toISOString(),
      reporter: {
        name: isAnonymous ? 'Ciudadano Anónimo' : reporterName,
        isAnonymous,
        contactPhone: isAnonymous ? undefined : reporterPhone,
        organization: isAnonymous ? undefined : 'Comunidad Afectada'
      },
      authorityAssigned: {
        agencyName: authority.name,
        jurisdiction: authority.coverageDescription,
        contactEmergency: authority.emergencyHotline,
        protocolName: `Protocolo de Intervención Rápida por ${activeMeta.label}`,
        notifiedAt: new Date().toISOString()
      },
      environmentalImpact: {
        waterSourcesAffected,
        floraFaunaRisk,
        populationAtRiskApprox: Number(populationAtRisk),
        estimatedVolumeOrArea: estimatedAreaOrVol || `${(affectedRadiusMeters / 1000).toFixed(1)} km² estimados`
      },
      updates: [
        {
          id: `upd-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Sistema EcoAlerta',
          message: `Alerta generada y despachada a ${authority.name} (${authority.emergencyHotline}). Folio oficial asignado: ${newFolio}.`
        }
      ]
    };

    onSubmitIncident(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Reportar Incidente Ambiental
              </h2>
              <p className="text-xs text-slate-400">
                Transmisión directa y georreferenciada a autoridades ambientales
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-semibold">
          {[
            { num: 1, label: '1. Categoría' },
            { num: 2, label: '2. Evidencia' },
            { num: 3, label: '3. GPS y Radio' },
            { num: 4, label: '4. Impacto & Enviar' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as 1 | 2 | 3 | 4)}
              className={`py-2.5 px-1 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                step === s.num
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : step > s.num
                  ? 'border-emerald-600/50 text-slate-300'
                  : 'border-transparent text-slate-500 hover:text-slate-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                step > s.num ? 'bg-emerald-600 text-white' : step === s.num ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label.split('. ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5">
          
          {/* STEP 1: CATEGORY & SEVERITY */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Selecciona la Categoría del Incidente *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(CATEGORY_METADATA) as IncidentCategory[]).map((catKey) => {
                    const cMeta = CATEGORY_METADATA[catKey];
                    const isSelected = category === catKey;
                    const catItems = CATEGORY_EVIDENCE_CATALOG[catKey];
                    return (
                      <div
                        key={catKey}
                        onClick={() => handleSelectCategory(catKey)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-800/95 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                            : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-white flex items-center gap-2">
                              <span>{catKey === 'oil_spill' ? '🛢️' : catKey === 'deforestation' ? '🌲' : catKey === 'water_pollution' ? '💧' : catKey === 'toxic_waste' ? '☣️' : '💨'}</span>
                              {cMeta.label}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">
                            {cMeta.description}
                          </p>
                        </div>

                        {/* Visual evidence thumbnails preview right on the category card */}
                        <div className="mt-2 pt-2 border-t border-slate-700/50">
                          <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden bg-slate-900/60 p-1 border border-slate-700/40 mb-1.5">
                            {catItems.map((item) => (
                              <div key={item.id} className="relative group/thumb h-11 rounded overflow-hidden bg-slate-950">
                                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center p-0.5 text-center">
                                  <span className="text-[8px] text-emerald-300 font-bold leading-none line-clamp-2">{item.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <span>📸</span> 4 evidencias visuales
                            </span>
                            <span className="text-slate-400 truncate max-w-[130px]">
                              {catItems[0].title}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nivel de Severidad / Urgencia *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'critical', label: 'Crítico / Emergencia', desc: 'Afecta acueductos o riesgo de vidas', color: 'bg-red-500/20 border-red-500 text-red-300' },
                    { id: 'high', label: 'Alto', desc: 'Daño ecológico severo en expansión', color: 'bg-amber-500/20 border-amber-500 text-amber-300' },
                    { id: 'medium', label: 'Moderado', desc: 'Foco contenido o de bajo volumen', color: 'bg-blue-500/20 border-blue-500 text-blue-300' }
                  ].map((lvl) => (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setSeverity(lvl.id as IncidentSeverity)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        severity === lvl.id
                          ? `${lvl.color} ring-1 ring-white/20 font-bold`
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{lvl.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5 leading-tight">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Título Breve del Reporte *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fuga de crudo en Caño Victoria Km 8"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Descripción Detallada del Incidente *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe cómo se detectó el incidente, color o viscosidad del agua, olor, presencia de fauna afectada o maquinaria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <span>Continuar a Evidencia Fotográfica</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTOS & EVIDENCE */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Evidencia Fotográfica del Incidente ({photos.length} seleccionadas)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSamplePhotos}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Restablecer todas ({CATEGORY_EVIDENCE_CATALOG[category].length})</span>
                  </button>
                </div>

                {/* Explicit feedback banner showing problem title & explanation */}
                <div className="mb-4 px-3.5 py-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-md">
                  <div className="flex items-center gap-2.5 text-emerald-300 font-medium">
                    <span className="text-xl">
                      {category === 'oil_spill' ? '🛢️' : category === 'deforestation' ? '🌲' : category === 'water_pollution' ? '💧' : category === 'toxic_waste' ? '☣️' : '💨'}
                    </span>
                    <div>
                      <div className="text-white font-bold leading-tight">
                        Evidencias correspondientes a: {activeMeta.label}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Cada fotografía detalla un punto crítico del incidente para fundamentar la respuesta de las autoridades.
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold whitespace-nowrap self-end sm:self-center">
                    Auto-asignado
                  </span>
                </div>

                {/* Grid of detailed photo cards with title, description and delete */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {photos.map((p, idx) => {
                    const info = findPhotoDetails(p);
                    return (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-850 flex flex-col shadow-lg">
                        <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                          <img src={p} alt={info.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Evidencia #{idx + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            title="Quitar esta foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3 bg-slate-800/90 border-t border-slate-700/60">
                          <div className="font-bold text-xs text-white leading-tight">
                            {info.title}
                          </div>
                          <div className="text-[10px] text-slate-300 leading-tight mt-1">
                            {info.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Upload button card */}
                  <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer text-slate-400 hover:text-emerald-400 transition-colors min-h-[160px] bg-slate-800/30">
                    <Upload className="w-7 h-7 mb-1.5 text-emerald-500" />
                    <span className="text-xs font-bold text-white">Subir Foto Real Adicional</span>
                    <span className="text-[10px] text-slate-400 text-center mt-1">Anexa pruebas desde tu celular o cámara</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Available catalog selector to toggle/swap photos with 1 click */}
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Catálogo Completo de Evidencias ({activeMeta.label})
                    </span>
                    <span className="text-[10px] text-slate-400">Toca para agregar/quitar</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORY_EVIDENCE_CATALOG[category].map((catItem) => {
                      const isAttached = photos.includes(catItem.url);
                      return (
                        <button
                          type="button"
                          key={catItem.id}
                          onClick={() => toggleCatalogPhoto(catItem.url)}
                          className={`p-1.5 rounded-lg border text-left flex flex-col transition-all cursor-pointer ${
                            isAttached
                              ? 'border-emerald-500/80 bg-emerald-950/40 ring-1 ring-emerald-500/30'
                              : 'border-slate-700/60 bg-slate-900/60 hover:border-slate-500 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="relative h-16 w-full rounded overflow-hidden mb-1.5">
                            <img src={catItem.url} alt={catItem.title} className="w-full h-full object-cover" />
                            {isAttached && (
                              <div className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-white truncate leading-tight">
                            {catItem.title}
                          </span>
                          <span className={`text-[9px] mt-0.5 font-semibold ${isAttached ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isAttached ? '✓ Adjuntada' : '+ Adjuntar'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Las fotografías anexadas incluirán metadatos de hora y georreferenciación para validación pericial de las autoridades.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <span>Continuar a Geolocalización</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GEOLOCATION & RADIUS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Geolocalización Satelital GPS
                  </div>
                  <div className="text-xs text-slate-400">
                    Lat: <span className="font-mono text-emerald-400">{lat.toFixed(5)}</span> | Lng: <span className="font-mono text-emerald-400">{lng.toFixed(5)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Obteniendo GPS...' : 'Mi GPS Actual'}</span>
                  </button>

                  {onStartMapPick && (
                    <button
                      type="button"
                      onClick={() => {
                        onStartMapPick();
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Fijar en Mapa</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Municipio / Distrito
                  </label>
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Departamento / Región
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Punto de Referencia o Dirección Rural
                </label>
                <input
                  type="text"
                  placeholder="Ej: Margen derecha del Río Magdalena, 500m aguas abajo del puente"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase text-slate-300 mb-1">
                  <span>Radio Estimado de Impacto / Mancha</span>
                  <span className="text-emerald-400 font-mono">{(affectedRadiusMeters / 1000).toFixed(2)} km ({affectedRadiusMeters} m)</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="6000"
                  step="100"
                  value={affectedRadiusMeters}
                  onChange={(e) => setAffectedRadiusMeters(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>200m (Puntual)</span>
                  <span>3.0 km (Regional)</span>
                  <span>6.0 km (Catastrófico)</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <span>Continuar a Impacto y Despacho</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: IMPACT & DISPATCH */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Automated Authority Preview */}
              <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Autoridad Ambiental Responsable
                  </span>
                  <span className="text-xs font-mono text-sky-300 bg-sky-900/60 px-2 py-0.5 rounded">
                    Línea: {authority.emergencyHotline}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{authority.name} ({authority.acronym})</div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {authority.coverageDescription}
                </p>
              </div>

              {/* Impact Checks */}
              <div className="space-y-2 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Factores de Vulnerabilidad
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waterSourcesAffected}
                    onChange={(e) => setWaterSourcesAffected(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                  />
                  <span>Compromiso inminente de ríos, quebradas, acuíferos o ciénagas</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={floraFaunaRisk}
                    onChange={(e) => setFloraFaunaRisk(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                  />
                  <span>Riesgo letal para especies animales, peces o bosques protegidos</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Población Aprox. en Riesgo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={populationAtRisk}
                    onChange={(e) => setPopulationAtRisk(Number(e.target.value))}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Volumen o Área Estimada
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: ~50 barriles / 5 hectáreas"
                    value={estimatedAreaOrVol}
                    onChange={(e) => setEstimatedAreaOrVol(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Anonymity / Reporter Details */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60 space-y-2.5">
                <label className="flex items-center gap-2 text-xs text-slate-200 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                  />
                  <span>Enviar como Reporte Ciudadano Anónimo (Protección de identidad)</span>
                </label>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Nombre / Veeduría</label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Teléfono de Contacto</label>
                      <input
                        type="text"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-red-900/40 transform active:scale-95 transition-all"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>DESPACHAR ALERTA OFICIAL</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
