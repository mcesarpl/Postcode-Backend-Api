import postcodeResponseEnhancedWithAirportDistance from '@src/fixtures/postcodeResponseEnhancedWithAirportDistance.json';
import postcodeResponseNotFound from '@src/fixtures/postcodeServiceNotFoundResponse.json';

describe('Postcode Routes functional tests', () => {
  it('should return an address with the distance to the airport', async () => {
    const response = await global.testRequest.get('/postcode/N76RS');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([postcodeResponseEnhancedWithAirportDistance]);
  });

  it('should not return an address when passing a valid one with slight difference', async () => {
    const response = await global.testRequest.get('/postcode/N76R');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([{...postcodeResponseNotFound, _id: "N76R"}]);
  });

  it('should return an address not found when passed an invalid postcode', async () => {
    const response = await global.testRequest.get('/postcode/NOTFOUND');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([postcodeResponseNotFound]);
  });

  it('should first return an address with session, after should return up to 3 last answers', async () => {
    const response = await global.testRequest.get('/postcode/N76RS');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([postcodeResponseEnhancedWithAirportDistance]);

    const session = response.headers.session;

    const secondResponse = await global.testRequest.get('/postcode/N76RS').set('session', session);
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers.session).not.toBeNull();
    expect(secondResponse.body).toEqual(expect.arrayContaining([postcodeResponseEnhancedWithAirportDistance, postcodeResponseEnhancedWithAirportDistance]));

    const thirdResponse = await global.testRequest.get('/postcode/NOTFOUND').set('session', session);
    expect(thirdResponse.status).toBe(200);
    expect(thirdResponse.headers.session).not.toBeNull();
    expect(thirdResponse.body).toEqual(expect.arrayContaining([postcodeResponseEnhancedWithAirportDistance, postcodeResponseEnhancedWithAirportDistance, postcodeResponseNotFound]));

  });
});
