import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  calculateHaversineDistance, 
  toDMS, 
  isValidCoordinate, 
  formatCoordinates, 
  getGeometricCenter 
} from '../utils/geo.ts';

describe('Geospatial Utilities (geo.ts)', () => {
  it('should accurately calculate Haversine distance between Bogota and Barrancabermeja', () => {
    // Bogota (~4.7110, -74.0721) to Barrancabermeja (~7.0653, -73.8547) is roughly 260-270 km
    const dist = calculateHaversineDistance(4.7110, -74.0721, 7.0653, -73.8547);
    assert.ok(dist > 250 && dist < 280, `Expected distance around 265km, got ${dist}`);
  });

  it('should return 0 km distance for identical coordinates', () => {
    const dist = calculateHaversineDistance(7.0653, -73.8547, 7.0653, -73.8547);
    assert.strictEqual(dist, 0);
  });

  it('should convert decimal latitude to DMS with North indicator', () => {
    const dms = toDMS(7.0653, true);
    assert.ok(dms.includes('°'));
    assert.ok(dms.includes('N'));
  });

  it('should convert decimal longitude to DMS with West indicator', () => {
    const dms = toDMS(-73.8547, false);
    assert.ok(dms.includes('°'));
    assert.ok(dms.includes('W'));
  });

  it('should properly validate valid geographic coordinates', () => {
    assert.strictEqual(isValidCoordinate(7.0653, -73.8547), true);
    assert.strictEqual(isValidCoordinate(0, 0), true);
    assert.strictEqual(isValidCoordinate(90, 180), true);
    assert.strictEqual(isValidCoordinate(-90, -180), true);
  });

  it('should reject invalid out-of-bounds coordinates', () => {
    assert.strictEqual(isValidCoordinate(95, -73.8547), false);
    assert.strictEqual(isValidCoordinate(7.0653, -200), false);
    assert.strictEqual(isValidCoordinate(NaN, -73.8547), false);
  });

  it('should format coordinates with default 4 decimal precision', () => {
    const formatted = formatCoordinates(7.065342, -73.854721);
    assert.strictEqual(formatted, '7.0653, -73.8547');
  });

  it('should calculate geometric center of multiple points', () => {
    const locations = [
      { lat: 10, lng: 20 },
      { lat: 20, lng: 40 },
    ];
    const center = getGeometricCenter(locations);
    assert.deepStrictEqual(center, { lat: 15, lng: 30 });
  });
});
