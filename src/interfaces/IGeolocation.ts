export interface IGeolocation {
  lat: string | number;
  longitude: string | number;
}

export interface IGeoDistanceParams {
  firstGeoPoint: IGeolocation;
  secondGeoPoint: IGeolocation;
}
