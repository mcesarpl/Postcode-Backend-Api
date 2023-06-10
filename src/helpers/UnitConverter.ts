export class UnitConverter {
  public static metersToKm(distanceInMeters: number): number {
    return distanceInMeters / 1000;
  }

  public static metersToMiles(distanceInMeters: number): number {
    return distanceInMeters * 0.00062137;
  }
}
