/**
 * Formats a date string into full Colombian localized date & time.
 * e.g. "8 de noviembre de 2026, 11:30 p.m."
 */
export function formatFullDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formats a date into a compact date representation.
 * e.g. "08/11/2026, 23:30"
 */
export function formatCompactDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formats a date relative to now in Spanish.
 * e.g. "Hace 15 minutos", "Hace 3 horas", "Ayer", etc.
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Hace unos segundos';
    if (diffMin < 60) return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return formatCompactDateTime(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Formats meters into human-readable metric distance (meters or kilometers).
 */
export function formatRadius(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km % 1 === 0 ? km.toFixed(0) : km.toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Generates an official incident tracking folio code.
 * e.g. "ECO-2026-X892"
 */
export function generateIncidentFolio(prefix = 'ECO'): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timeSlice = Date.now().toString().slice(-3);
  return `${prefix}-${year}-${randomSuffix}${timeSlice}`;
}

/**
 * Sanitizes and formats phone numbers for WhatsApp or call links.
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

