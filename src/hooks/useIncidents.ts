import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Incident, 
  IncidentCategory, 
  IncidentSeverity, 
  IncidentSortOption, 
  IncidentStatistics, 
  IncidentStatus, 
  IncidentUpdate 
} from '../types';
import { incidentService } from '../services/incidentService';
import { exportIncidentsToCSV, exportIncidentsToJSON } from '../utils/export';
import { useDebounce } from './useDebounce';

export interface UseIncidentsReturn {
  incidents: Incident[];
  filteredIncidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  // Filters and search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: IncidentCategory | 'all';
  setCategoryFilter: (category: IncidentCategory | 'all') => void;
  severityFilter: IncidentSeverity | 'all';
  setSeverityFilter: (severity: IncidentSeverity | 'all') => void;
  statusFilter: IncidentStatus | 'all';
  setStatusFilter: (status: IncidentStatus | 'all') => void;
  sortBy: IncidentSortOption;
  setSortBy: (sort: IncidentSortOption) => void;
  // Operations
  createIncident: (newIncident: Incident) => void;
  updateStatus: (incidentId: string, newStatus: IncidentStatus, note: string) => void;
  addComment: (incidentId: string, author: string, message: string) => void;
  resetDemo: () => void;
  exportCSV: () => void;
  exportJSON: () => void;
  // Analytics
  statistics: IncidentStatistics;
  criticalCount: number;
}

export function useIncidents(): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IncidentCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<IncidentSortOption>('newest');

  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  // Initial load
  useEffect(() => {
    const loaded = incidentService.getIncidents();
    setIncidents(loaded);
  }, []);

  // Compute filtered & sorted list
  const filteredIncidents = useMemo(() => {
    return incidentService.filterAndSort(
      incidents,
      {
        searchTerm: debouncedSearchTerm,
        category: categoryFilter,
        severity: severityFilter,
        status: statusFilter,
      },
      sortBy
    );
  }, [incidents, debouncedSearchTerm, categoryFilter, severityFilter, statusFilter, sortBy]);

  // Compute statistics
  const statistics = useMemo(() => {
    return incidentService.computeStatistics(incidents);
  }, [incidents]);

  const criticalCount = statistics.activeCritical;

  // Actions
  const createIncident = useCallback((newIncident: Incident) => {
    setIncidents((prev) => {
      const updated = [newIncident, ...prev];
      incidentService.saveIncidents(updated);
      return updated;
    });
  }, []);

  const updateStatus = useCallback((incidentId: string, newStatus: IncidentStatus, note: string) => {
    setIncidents((prev) => {
      const updated = prev.map((inc) => {
        if (inc.id === incidentId) {
          const newUpdate: IncidentUpdate = {
            id: `upd-${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: 'Despacho de Control Ambiental',
            message: note || `Estado actualizado a ${newStatus}`,
            newStatus,
          };
          return {
            ...inc,
            status: newStatus,
            updates: [newUpdate, ...(inc.updates || [])],
          };
        }
        return inc;
      });

      incidentService.saveIncidents(updated);

      setSelectedIncident((currentSelected) => {
        if (currentSelected && currentSelected.id === incidentId) {
          return updated.find(i => i.id === incidentId) || null;
        }
        return currentSelected;
      });

      return updated;
    });
  }, []);

  const addComment = useCallback((incidentId: string, author: string, message: string) => {
    setIncidents((prev) => {
      const updated = prev.map((inc) => {
        if (inc.id === incidentId) {
          const newUpdate: IncidentUpdate = {
            id: `upd-${Date.now()}`,
            timestamp: new Date().toISOString(),
            author,
            message,
          };
          return {
            ...inc,
            updates: [...(inc.updates || []), newUpdate],
          };
        }
        return inc;
      });

      incidentService.saveIncidents(updated);

      setSelectedIncident((currentSelected) => {
        if (currentSelected && currentSelected.id === incidentId) {
          return updated.find(i => i.id === incidentId) || null;
        }
        return currentSelected;
      });

      return updated;
    });
  }, []);

  const resetDemo = useCallback(() => {
    const initial = incidentService.resetToDemo();
    setIncidents(initial);
    setSelectedIncident(null);
  }, []);

  const exportCSV = useCallback(() => {
    exportIncidentsToCSV(filteredIncidents);
  }, [filteredIncidents]);

  const exportJSON = useCallback(() => {
    exportIncidentsToJSON(filteredIncidents);
  }, [filteredIncidents]);

  return {
    incidents,
    filteredIncidents,
    selectedIncident,
    setSelectedIncident,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    createIncident,
    updateStatus,
    addComment,
    resetDemo,
    exportCSV,
    exportJSON,
    statistics,
    criticalCount,
  };
}

