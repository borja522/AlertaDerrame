import { Incident } from '../types';
import { incidentService } from '../services/incidentService';

export function loadStoredIncidents(): Incident[] {
  return incidentService.getIncidents();
}

export function saveIncidents(incidents: Incident[]): void {
  incidentService.saveIncidents(incidents);
}

export function resetToDemoIncidents(): Incident[] {
  return incidentService.resetToDemo();
}
