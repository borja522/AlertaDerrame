import { 
  Incident, 
  IncidentFilterCriteria, 
  IncidentSortOption, 
  IncidentStatistics, 
  IncidentStatus, 
  IncidentUpdate 
} from '../types';
import { INITIAL_MOCK_INCIDENTS } from '../data/mockIncidents';
import { APP_CONFIG, SEVERITY_WEIGHTS } from '../constants';

class IncidentService {
  private readonly storageKey = APP_CONFIG.STORAGE_KEY_INCIDENTS;

  /**
   * Retrieves all incidents from persistent storage or initial seeds.
   */
  public getIncidents(): Incident[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.saveIncidents(INITIAL_MOCK_INCIDENTS);
        return INITIAL_MOCK_INCIDENTS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return INITIAL_MOCK_INCIDENTS;
    } catch (error) {
      console.error('[IncidentService] Error retrieving stored incidents:', error);
      return INITIAL_MOCK_INCIDENTS;
    }
  }

  /**
   * Persists the incidents array to storage.
   */
  public saveIncidents(incidents: Incident[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(incidents));
    } catch (error) {
      console.error('[IncidentService] Error saving incidents to storage:', error);
    }
  }

  /**
   * Restores incidents to baseline mock demo dataset.
   */
  public resetToDemo(): Incident[] {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_MOCK_INCIDENTS));
    } catch (error) {
      console.error('[IncidentService] Error resetting demo data:', error);
    }
    return INITIAL_MOCK_INCIDENTS;
  }

  /**
   * Filters and sorts incidents according to criteria.
   */
  public filterAndSort(
    incidents: Incident[],
    criteria: IncidentFilterCriteria,
    sortBy: IncidentSortOption = 'newest'
  ): Incident[] {
    const term = (criteria.searchTerm || '').trim().toLowerCase();

    const filtered = incidents.filter((inc) => {
      // Category filter
      if (criteria.category && criteria.category !== 'all' && inc.category !== criteria.category) {
        return false;
      }

      // Severity filter
      if (criteria.severity && criteria.severity !== 'all' && inc.severity !== criteria.severity) {
        return false;
      }

      // Status filter
      if (criteria.status && criteria.status !== 'all' && inc.status !== criteria.status) {
        return false;
      }

      // Search term query
      if (term) {
        const titleMatch = inc.title.toLowerCase().includes(term);
        const folioMatch = inc.folioNumber.toLowerCase().includes(term);
        const muniMatch = inc.location.municipality?.toLowerCase().includes(term) ?? false;
        const deptMatch = inc.location.department?.toLowerCase().includes(term) ?? false;
        const addrMatch = inc.location.address?.toLowerCase().includes(term) ?? false;
        const descMatch = inc.description.toLowerCase().includes(term);

        if (!titleMatch && !folioMatch && !muniMatch && !deptMatch && !addrMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'severity_desc':
          return (SEVERITY_WEIGHTS[b.severity] || 0) - (SEVERITY_WEIGHTS[a.severity] || 0);
        case 'radius_desc':
          return b.affectedRadiusMeters - a.affectedRadiusMeters;
        case 'title_asc':
          return a.title.localeCompare(b.title, 'es');
        default:
          return 0;
      }
    });
  }

  /**
   * Computes dashboard and operational analytics from incidents.
   */
  public computeStatistics(incidents: Incident[]): IncidentStatistics {
    const stats: IncidentStatistics = {
      totalIncidents: incidents.length,
      activeCritical: 0,
      containmentActive: 0,
      resolvedCount: 0,
      totalAffectedRadiusKm: 0,
      byCategory: {
        oil_spill: 0,
        deforestation: 0,
        water_pollution: 0,
        air_pollution: 0,
        toxic_waste: 0,
      },
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      byStatus: {
        reported: 0,
        triaged: 0,
        in_investigation: 0,
        containment_active: 0,
        resolved: 0,
      },
    };

    let totalMeters = 0;

    for (const inc of incidents) {
      // Category count
      if (stats.byCategory[inc.category] !== undefined) {
        stats.byCategory[inc.category]++;
      }
      // Severity count
      if (stats.bySeverity[inc.severity] !== undefined) {
        stats.bySeverity[inc.severity]++;
      }
      // Status count
      if (stats.byStatus[inc.status] !== undefined) {
        stats.byStatus[inc.status]++;
      }

      if (inc.severity === 'critical' && inc.status !== 'resolved') {
        stats.activeCritical++;
      }
      if (inc.status === 'containment_active') {
        stats.containmentActive++;
      }
      if (inc.status === 'resolved') {
        stats.resolvedCount++;
      }

      totalMeters += inc.affectedRadiusMeters || 0;
    }

    stats.totalAffectedRadiusKm = parseFloat((totalMeters / 1000).toFixed(1));
    return stats;
  }
}

export const incidentService = new IncidentService();

