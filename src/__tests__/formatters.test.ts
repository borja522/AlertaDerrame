import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  formatRadius, 
  generateIncidentFolio, 
  sanitizePhoneNumber 
} from '../utils/formatters.ts';

describe('Formatters Utilities (formatters.ts)', () => {
  it('should format radius under 1000 meters in meters unit', () => {
    assert.strictEqual(formatRadius(450), '450 m');
    assert.strictEqual(formatRadius(999), '999 m');
  });

  it('should format radius >= 1000 meters in kilometers unit', () => {
    assert.strictEqual(formatRadius(1000), '1 km');
    assert.strictEqual(formatRadius(2500), '2.5 km');
    assert.strictEqual(formatRadius(10000), '10 km');
  });

  it('should generate a valid official folio code matching format', () => {
    const folio = generateIncidentFolio('ECO');
    const currentYear = new Date().getFullYear();
    assert.ok(folio.startsWith(`ECO-${currentYear}-`));
    assert.ok(folio.length >= 12);
  });

  it('should sanitize phone numbers removing non-digit characters', () => {
    assert.strictEqual(sanitizePhoneNumber('+57 (300) 123-4567'), '+573001234567');
    assert.strictEqual(sanitizePhoneNumber('01 8000 112 998'), '018000112998');
  });
});
