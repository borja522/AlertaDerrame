import { Incident } from '../types';
import { formatCompactDateTime } from './formatters';

/**
 * Triggers a download in the browser for a string blob.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports an array of incidents to CSV file with UTF-8 BOM for perfect Excel compatibility.
 */
export function exportIncidentsToCSV(incidents: Incident[], filenamePrefix = 'reporte_incidentes_ecoalerta'): void {
  const headers = [
    'Folio',
    'Titulo',
    'Categoria',
    'Severidad',
    'Estado',
    'Municipio',
    'Departamento',
    'Latitud',
    'Longitud',
    'Radio_Metros',
    'Autoridad_Asignada',
    'Reportado_Por',
    'Contacto_Reportante',
    'Fecha_Creacion',
    'Total_Actualizaciones',
    'Descripcion'
  ];

  const rows = incidents.map((inc) => [
    `"${inc.folioNumber}"`,
    `"${inc.title.replace(/"/g, '""')}"`,
    `"${inc.category}"`,
    `"${inc.severity}"`,
    `"${inc.status}"`,
    `"${(inc.location.municipality || '').replace(/"/g, '""')}"`,
    `"${(inc.location.department || '').replace(/"/g, '""')}"`,
    inc.location.lat,
    inc.location.lng,
    inc.affectedRadiusMeters,
    `"${(inc.authorityAssigned?.agencyName || '').replace(/"/g, '""')}"`,
    `"${(inc.reporter.isAnonymous ? 'Anónimo' : inc.reporter.name).replace(/"/g, '""')}"`,
    `"${(inc.reporter.contactPhone || '').replace(/"/g, '""')}"`,
    `"${formatCompactDateTime(inc.createdAt)}"`,
    inc.updates?.length || 0,
    `"${(inc.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const dateStamp = new Date().toISOString().slice(0, 10);
  triggerFileDownload(csvContent, `${filenamePrefix}_${dateStamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports an array of incidents to JSON formatted file.
 */
export function exportIncidentsToJSON(incidents: Incident[], filenamePrefix = 'ecoalerta_dataset'): void {
  const data = {
    exportedAt: new Date().toISOString(),
    totalRecords: incidents.length,
    dataset: incidents,
  };
  const jsonContent = JSON.stringify(data, null, 2);
  const dateStamp = new Date().toISOString().slice(0, 10);
  triggerFileDownload(jsonContent, `${filenamePrefix}_${dateStamp}.json`, 'application/json');
}

/**
 * Generates an executive technical summary of a single incident.
 */
export function generateIncidentTechnicalSheet(incident: Incident): string {
  return `FICHA TÉCNICA DE INCIDENTE AMBIENTAL - ECOALERTA
==================================================
Folio Oficial: ${incident.folioNumber}
Título: ${incident.title}
Fecha de Reporte: ${formatCompactDateTime(incident.createdAt)}
Categoría: ${incident.category}
Severidad: ${incident.severity.toUpperCase()}
Estado de Respuesta: ${incident.status}

UBICACIÓN GEORREFERENCIADA
-------------------------
Municipio: ${incident.location.municipality || 'No especificado'}
Departamento: ${incident.location.department || 'No especificado'}
Dirección/Referencia: ${incident.location.address || 'Sin dirección específica'}
Coordenadas GPS: Latitud ${incident.location.lat.toFixed(6)}, Longitud ${incident.location.lng.toFixed(6)}
Radio Estimado de Impacto: ${incident.affectedRadiusMeters} metros

AUTORIDAD AMBIENTAL ASIGNADA
---------------------------
Entidad: ${incident.authorityAssigned.agencyName}
Jurisdicción: ${incident.authorityAssigned.jurisdiction}
Protocolo Activado: ${incident.authorityAssigned.protocolName}
Línea de Emergencia: ${incident.authorityAssigned.contactEmergency}
Notificado: ${formatCompactDateTime(incident.authorityAssigned.notifiedAt)}

DETALLES DEL IMPACTO
--------------------
Fuentes de agua comprometidas: ${incident.environmentalImpact.waterSourcesAffected ? 'SÍ' : 'NO'}
Riesgo para flora y fauna: ${incident.environmentalImpact.floraFaunaRisk ? 'SÍ' : 'NO'}
Población estimada en riesgo: ${incident.environmentalImpact.populationAtRiskApprox ?? 'En evaluación'}
Volumen o área calculada: ${incident.environmentalImpact.estimatedVolumeOrArea || 'Pendiente peritaje'}

DESCRIPCIÓN DEL INCIDENTE
-------------------------
${incident.description}

BITÁCORA DE ACTUALIZACIONES (${incident.updates?.length || 0})
---------------------------
${(incident.updates || []).map((u, i) => `[${i + 1}] ${formatCompactDateTime(u.timestamp)} - ${u.author}: ${u.message}`).join('\n')}
==================================================
Generado automáticamente por el Sistema de Alerta Temprana EcoAlerta.
`;
}
