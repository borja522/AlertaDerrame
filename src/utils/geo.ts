import type { CoordinatesDMS, LocationInfo } from '../types/index.ts';

/**
 * Calculates the great-circle distance between two coordinates using the Haversine formula.
 * @returns Distance in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats decimal latitude/longitude into Degrees, Minutes, Seconds (DMS) string
 * for military, maritime and environmental authority records.
 */
export function toDMS(coordinate: number, isLatitude: boolean): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

  let direction = '';
  if (isLatitude) {
    direction = coordinate >= 0 ? 'N' : 'S';
  } else {
    direction = coordinate >= 0 ? 'E' : 'W';
  }

  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

/**
 * Converts a lat/lng coordinate pair to structured DMS object.
 */
export function getCoordinatesDMS(lat: number, lng: number): CoordinatesDMS {
  return {
    latDMS: toDMS(lat, true),
    lngDMS: toDMS(lng, false),
  };
}

/**
 * Validates if coordinates fall within valid geographic bounds.
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Formats coordinates for quick copy and display.
 */
export function formatCoordinates(lat: number, lng: number, precision = 4): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

/**
 * Calculates geographic center from an array of locations.
 */
export function getGeometricCenter(locations: LocationInfo[]): { lat: number; lng: number } | null {
  if (locations.length === 0) return null;
  const valid = locations.filter(loc => isValidCoordinate(loc.lat, loc.lng));
  if (valid.length === 0) return null;

  const total = valid.reduce(
    (acc, curr) => ({ lat: acc.lat + curr.lat, lng: acc.lng + curr.lng }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: total.lat / valid.length,
    lng: total.lng / valid.length,
  };
}

