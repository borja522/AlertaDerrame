import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  calculateSpillDrift, 
  degreesToCompass, 
  findNearestBasinProfile 
} from '../services/weatherService.ts';

describe('Weather & Drift Dispersion (weatherService.ts)', () => {
  it('should correctly convert degrees to compass directions', () => {
    assert.strictEqual(degreesToCompass(0), 'N');
    assert.strictEqual(degreesToCompass(90), 'E');
    assert.strictEqual(degreesToCompass(180), 'S');
    assert.strictEqual(degreesToCompass(270), 'W');
  });

  it('should calculate projected drift distance and area over time', () => {
    const projection = calculateSpillDrift(
      7.0653,
      -73.8547,
      15, // 15 km/h wind
      45, // NE wind direction
      2.0, // 2 knots current
      3 // 3 hours elapsed
    );

    assert.strictEqual(projection.hoursElapsed, 3);
    assert.ok(projection.projectedDistanceMeters > 0);
    assert.ok(projection.estimatedAreaSquareMeters > 0);
    assert.ok(projection.evaporationPercentage > 15);
  });

  it('should identify Magdalena Medio basin profile for Barrancabermeja coordinates', () => {
    const basin = findNearestBasinProfile(7.0653, -73.8547);
    assert.strictEqual(basin.department, 'Santander');
    assert.ok(basin.mainRiver.includes('Magdalena'));
  });
});
