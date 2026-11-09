import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateIncidentForm, type IncidentFormData } from '../utils/validators.ts';

describe('Validation Utilities (validators.ts)', () => {
  const validReport: IncidentFormData = {
    title: 'Derrame en Caño San Silvestre',
    category: 'oil_spill',
    severity: 'critical',
    description: 'Fuga de crudo detectada en tramo de oleoducto cerca al puente.',
    lat: 7.0653,
    lng: -73.8547,
    affectedRadiusMeters: 1500,
    isAnonymous: true,
  };

  it('should validate a complete and well-formed report as valid', () => {
    const result = validateIncidentForm(validReport);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.errors, {});
  });

  it('should invalidate reports with short titles (< 5 characters)', () => {
    const result = validateIncidentForm({ ...validReport, title: 'Fuga' });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.title);
  });

  it('should invalidate reports with short descriptions (< 15 characters)', () => {
    const result = validateIncidentForm({ ...validReport, description: 'Derrame leve' });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.description);
  });

  it('should invalidate non-anonymous reports without a reporter name', () => {
    const result = validateIncidentForm({ 
      ...validReport, 
      isAnonymous: false, 
      reporterName: '' 
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.reporterName);
  });

  it('should invalidate invalid coordinates', () => {
    const result = validateIncidentForm({ ...validReport, lat: 999 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.location);
  });
});
