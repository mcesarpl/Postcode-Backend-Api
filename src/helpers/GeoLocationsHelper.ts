import { IGeoDistanceParams } from '@src/interfaces';
import { getDistance } from 'geolib';

export class GeoLocationsHelper {
  public static getDistanceInMeters(
    geoPoints: IGeoDistanceParams,
    geoAccuracy = 1,
  ) {
    return getDistance(
      geoPoints.firstGeoPoint,
      geoPoints.secondGeoPoint,
      geoAccuracy,
    );
  }
}
