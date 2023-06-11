import { UnitConverter } from '../UnitConverter';

describe('UnitConverter methods tests', () => {
  it('should receive meters and return in Km', () => {
    const result = UnitConverter.metersToKm(1500);
    expect(result).toEqual(1.5);
  });

  it('should receive meters and return in Miles', () => {
    const result = UnitConverter.metersToMiles(1500);
    expect(result).toEqual(0.932055);
  });
});
