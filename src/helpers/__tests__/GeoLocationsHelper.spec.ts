import { GeoLocationsHelper } from '..';

const fortalezaGeoPoints = {
  lat: -3.71839,
  longitude: -38.5434,
};

const lisbonGeoPoints = {
  lat: 38.7071,
  longitude: -9.13549,
};

const distanceInMetersBetweenFortalezaAndLisbon = 5607262;

describe('GeoLocationsHelper methods tester', () => {
  it('should return a distance between two geo coordinates', () => {
    const distance = GeoLocationsHelper.getDistanceInMeters({
      firstGeoPoint: fortalezaGeoPoints,
      secondGeoPoint: lisbonGeoPoints,
    });

    expect(distance).toEqual(distanceInMetersBetweenFortalezaAndLisbon);
  });
});
