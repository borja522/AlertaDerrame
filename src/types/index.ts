export type IncidentCategory = 
  | 'oil_spill' 
  | 'deforestation' 
  | 'water_pollution' 
  | 'air_pollution' 
  | 'toxic_waste';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus = 
  | 'reported' 
  | 'triaged' 
  | 'in_investigation' 
  | 'containment_active' 
  | 'resolved';

export interface LocationInfo {
  lat: number;
  lng: number;
  address?: string;
  department?: string;
  municipality?: string;
  accuracyMeters?: number;
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  newStatus?: IncidentStatus;
}

export interface EnvironmentalImpact {
  waterSourcesAffected?: boolean;
  floraFaunaRisk?: boolean;
  populationAtRiskApprox?: number;
  estimatedVolumeOrArea?: string;
}

export interface Incident {
  id: string;
  folioNumber: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  location: LocationInfo;
  affectedRadiusMeters: number;
  photos: string[];
  createdAt: string;
  reporter: {
    name: string;
    isAnonymous: boolean;
    contactPhone?: string;
    organization?: string;
  };
  authorityAssigned: {
    agencyName: string;
    jurisdiction: string;
    contactEmergency: string;
    protocolName: string;
    notifiedAt: string;
  };
  environmentalImpact: EnvironmentalImpact;
  updates: IncidentUpdate[];
}

export interface EnvironmentalAuthority {
  id: string;
  name: string;
  acronym: string;
  type: 'national' | 'regional' | 'maritime' | 'emergency';
  coverageDescription: string;
  emergencyHotline: string;
  categoriesHandled: IncidentCategory[];
}
