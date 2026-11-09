import { triggerFileDownload } from '../utils/export';
import { formatCompactDateTime } from '../utils/formatters';

export type AuditActionType = 
  | 'incident_created' 
  | 'status_changed' 
  | 'comment_added' 
  | 'report_exported' 
  | 'demo_reset' 
  | 'location_picked';

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditActionType;
  incidentFolio?: string;
  actor: string;
  details: string;
  userAgent?: string;
}

const AUDIT_STORAGE_KEY = 'ecoalerta_audit_trail_v1';
const MAX_AUDIT_ENTRIES = 250;

class AuditService {
  /**
   * Retrieves all recorded audit entries.
   */
  public getEntries(): AuditEntry[] {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Appends a new immutable action record to the audit trail.
   */
  public log(
    action: AuditActionType,
    details: string,
    incidentFolio?: string,
    actor = 'Operador del Sistema'
  ): void {
    try {
      const entry: AuditEntry = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        action,
        incidentFolio,
        actor,
        details,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      };

      const existing = this.getEntries();
      const updated = [entry, ...existing].slice(0, MAX_AUDIT_ENTRIES);
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('[AuditService] Failed to record audit log:', err);
    }
  }

  /**
   * Clears historical audit logs.
   */
  public clear(): void {
    try {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * Exports full audit log in CSV format for institutional inspections.
   */
  public exportCSV(): void {
    const entries = this.getEntries();
    const headers = ['ID', 'Fecha_Hora', 'Accion', 'Folio_Incidente', 'Operador', 'Detalles'];
    const rows = entries.map(e => [
      `"${e.id}"`,
      `"${formatCompactDateTime(e.timestamp)}"`,
      `"${e.action}"`,
      `"${e.incidentFolio || 'N/A'}"`,
      `"${e.actor.replace(/"/g, '""')}"`,
      `"${e.details.replace(/"/g, '""')}"`
    ]);

    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const dateStamp = new Date().toISOString().slice(0, 10);
    triggerFileDownload(csv, `ecoalerta_auditoria_${dateStamp}.csv`, 'text/csv;charset=utf-8;');
  }
}

export const auditService = new AuditService();

