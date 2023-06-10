import { IPostcodeResponse } from '@src/interfaces/IPostcodeResponse';
import { GeoLocationsHelper } from './GeoLocationsHelper';
import config, { IConfig } from 'config';
import { IGeolocation } from '@src/interfaces';
import { UnitConverter } from '.';

export class EnhancePostcodeResponse {
  public static addAirportDistance(
    postcodeReshapedResponse: IPostcodeResponse,
  ) {
    const airports: IConfig = config.get('App.airportGeoLocation');

    const airportHeathrowGeolocation: IGeolocation = airports.get('Heathrow');

    const distanceInMeters = GeoLocationsHelper.getDistanceInMeters({
      firstGeoPoint: {
        lat: postcodeReshapedResponse.latitude,
        longitude: postcodeReshapedResponse.longitude,
      },
      secondGeoPoint: {
        lat: airportHeathrowGeolocation.lat,
        longitude: airportHeathrowGeolocation.longitude,
      },
    });

    return {
      ...postcodeReshapedResponse,
      distanceToAirport: {
        airportName: 'Heathrow',
        inKm: UnitConverter.metersToKm(distanceInMeters),
        inMiles: UnitConverter.metersToMiles(distanceInMeters),
      },
    };
  }
}
