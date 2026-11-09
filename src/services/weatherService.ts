/**
 * Weather & Environmental Dispersion Service
 * Implements standard drift estimation models for oil spills and airborne pollutants
 * according to the Colombian National Contingency Plan (Decreto 321 de 1999).
 */

export interface WeatherCondition {
  temperatureCelsius: number;
  windSpeedKmH: number;
  windDirectionDegrees: number; // 0-360 degrees (0 = North)
  windDirectionText: string;
  riverCurrentVelocityKnots?: number;
  humidityPercentage: number;
  precipitationRisk: 'none' | 'low' | 'moderate' | 'heavy';
}

export interface SpillDriftProjection {
  hoursElapsed: number;
  projectedDistanceMeters: number;
  estimatedAreaSquareMeters: number;
  projectedLat: number;
  projectedLng: number;
  evaporationPercentage: number;
}

export interface BasinProfile {
  basinName: string;
  department: string;
  mainRiver: string;
  averageCurrentSpeedKnots: number;
  criticalSensitivities: string[];
}

export const COLOMBIAN_HYDRO_BASINS: BasinProfile[] = [
  {
    basinName: 'Cuenca Media del Río Magdalena',
    department: 'Santander',
    mainRiver: 'Río Magdalena',
    averageCurrentSpeedKnots: 2.4,
    criticalSensitivities: ['Ciénaga San Silvestre', 'Bocatomas de acueducto Barrancabermeja', 'Fauna ictiológica (Manatí del Caribe)'],
  },
  {
    basinName: 'Cuenca del Catatumbo',
    department: 'Norte de Santander',
    mainRiver: 'Río Catatumbo / Tibú',
    averageCurrentSpeedKnots: 2.1,
    criticalSensitivities: ['Reserva Indígena Motilón Barí', 'Fuentes hídricas veredales'],
  },
  {
    basinName: 'Cuenca Pacífica Sur',
    department: 'Nariño',
    mainRiver: 'Río Mira / Estero Curay',
    averageCurrentSpeedKnots: 1.8,
    criticalSensitivities: ['Manglares de Tumaco', 'Zonas de pesca artesanal', 'Santuario Flora y Fauna'],
  },
  {
    basinName: 'Cuenca del Putumayo',
    department: 'Putumayo',
    mainRiver: 'Río Putumayo / Orito',
    averageCurrentSpeedKnots: 2.8,
    criticalSensitivities: ['Bosque de galería amazónico', 'Comunidades ribereñas indígenas'],
  },
  {
    basinName: 'Cuenca del Meta - Orinoco',
    department: 'Meta',
    mainRiver: 'Río Meta',
    averageCurrentSpeedKnots: 1.9,
    criticalSensitivities: ['Humedales del Llano', 'Sabanas inundables'],
  },
];

/**
 * Calculates compass direction text from wind azimuth angle.
 */
export function degreesToCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Calculates the projected geographic coordinates and affected surface area of a contaminant plume
 * using vector displacement of wind (3% rule) and surface river current (100% vector rule).
 */
export function calculateSpillDrift(
  originLat: number,
  originLng: number,
  windSpeedKmH: number,
  windDirectionDeg: number,
  riverCurrentKnots: number,
  hoursPassed: number
): SpillDriftProjection {
  // Hydrodynamic standard: spill drifts at ~3% of wind speed + ~100% of surface river current
  const windDriftSpeedKmH = windSpeedKmH * 0.03;
  const riverDriftSpeedKmH = riverCurrentKnots * 1.852;
  const netVelocityKmH = windDriftSpeedKmH + riverDriftSpeedKmH;

  const totalDistanceKm = netVelocityKmH * hoursPassed;
  const totalDistanceMeters = Math.round(totalDistanceKm * 1000);

  // Geographic displacement (1 deg latitude ≈ 111 km)
  const radians = (windDirectionDeg * Math.PI) / 180;
  const deltaLat = (totalDistanceKm * Math.cos(radians)) / 111;
  const deltaLng = (totalDistanceKm * Math.sin(radians)) / (111 * Math.cos((originLat * Math.PI) / 180));

  // Fay's gravity-viscous spreading approximation for light/medium crudes
  const baseAreaSquareMeters = Math.PI * Math.pow(Math.max(50, totalDistanceMeters * 0.4), 2);

  // Evaporation rate estimation (light fractions evaporate roughly 25-45% within 24 hours)
  const evaporationPercentage = Math.min(50, Math.round(15 + Math.log(hoursPassed + 1) * 10));

  return {
    hoursElapsed: hoursPassed,
    projectedDistanceMeters: totalDistanceMeters,
    estimatedAreaSquareMeters: Math.round(baseAreaSquareMeters),
    projectedLat: originLat + deltaLat,
    projectedLng: originLng + deltaLng,
    evaporationPercentage,
  };
}

/**
 * Retrieves hydrographic basin profile nearest to given coordinates.
 */
export function findNearestBasinProfile(lat: number, lng: number): BasinProfile {
  // Approximate Barrancabermeja / Magdalena Medio region
  if (lat >= 6.0 && lat <= 8.5 && lng >= -74.8 && lng <= -73.0) {
    return COLOMBIAN_HYDRO_BASINS[0];
  }
  // Catatumbo
  if (lat >= 7.5 && lat <= 9.2 && lng >= -73.5 && lng <= -72.2) {
    return COLOMBIAN_HYDRO_BASINS[1];
  }
  // Tumaco
  if (lat >= 1.0 && lat <= 3.0 && lng <= -77.5) {
    return COLOMBIAN_HYDRO_BASINS[2];
  }
  // Putumayo
  if (lat <= 1.2 && lng <= -76.0) {
    return COLOMBIAN_HYDRO_BASINS[3];
  }

  // Fallback to Magdalena Medio
  return COLOMBIAN_HYDRO_BASINS[0];
}

