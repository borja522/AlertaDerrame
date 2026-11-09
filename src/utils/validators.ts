import { IncidentCategory, IncidentSeverity } from '../types';
import { isValidCoordinate } from './geo';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface IncidentFormData {
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  lat: number;
  lng: number;
  affectedRadiusMeters: number;
  reporterName?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
}

/**
 * Validates the citizen incident report form before submitting.
 */
export function validateIncidentForm(data: IncidentFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'El título del reporte debe contener al menos 5 caracteres.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'El título no debe exceder los 120 caracteres.';
  }

  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'Por favor proporcione una descripción más detallada (mínimo 15 caracteres).';
  }

  if (!isValidCoordinate(data.lat, data.lng)) {
    errors.location = 'Las coordenadas geográficas no son válidas.';
  }

  if (typeof data.affectedRadiusMeters !== 'number' || data.affectedRadiusMeters <= 0) {
    errors.radius = 'El radio de afectación debe ser un valor numérico positivo.';
  }

  if (!data.isAnonymous && (!data.reporterName || data.reporterName.trim().length < 2)) {
    errors.reporterName = 'Si no es anónimo, indique el nombre completo del informante.';
  }

  if (data.reporterPhone && data.reporterPhone.trim().length > 0) {
    const cleanPhone = data.reporterPhone.replace(/\D/g, '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      errors.reporterPhone = 'El número telefónico de contacto no tiene un formato válido.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
