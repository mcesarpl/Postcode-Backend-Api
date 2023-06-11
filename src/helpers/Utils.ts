export class Utils {
  public static notNullNotUndefined<T>(
    value: T | null | undefined,
  ): value is T {
    return value !== null && value !== undefined;
  }
}
