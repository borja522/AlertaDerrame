import { Incident } from '../types';
import { INITIAL_MOCK_INCIDENTS } from '../data/mockIncidents';

const STORAGE_KEY = 'ecoalerta_incidents_v1';

export function loadStoredIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_INCIDENTS));
      return INITIAL_MOCK_INCIDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_INCIDENTS;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_MOCK_INCIDENTS;
  }
}

export function saveIncidents(incidents: Incident[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function resetToDemoIncidents(): Incident[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_INCIDENTS));
  } catch (err) {
    console.error(err);
  }
  return INITIAL_MOCK_INCIDENTS;
}
