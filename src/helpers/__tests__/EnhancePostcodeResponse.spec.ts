import postcodeServiceReshapedResponse from '@src/fixtures/postcodeServiceReshapedResponse.json';
import postcodeResponseEnhancedWithAirportDistance from '@src/fixtures/postcodeResponseEnhancedWithAirportDistance.json';
import { EnhancePostcodeResponse } from '..';

describe('EnhancePostcodeResponse methods tests', () => {
  it('should receive IPostcodeResponse and add distance to the airport', () => {
    expect(
      EnhancePostcodeResponse.addAirportDistance(
        postcodeServiceReshapedResponse,
      ),
    ).toEqual(postcodeResponseEnhancedWithAirportDistance);
  });
});
