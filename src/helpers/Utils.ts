import {
  IPostcodeResponse,
  IPostcodeResponseSuccess,
} from '@src/interfaces/IPostcodeResponse';

export class Utils {
  public static notNullNotUndefined<T>(
    value: T | null | undefined,
  ): value is T {
    return value !== null && value !== undefined;
  }

  public static isPostcodeResponseSuccess(
    postcodeResponse: IPostcodeResponse,
  ): postcodeResponse is IPostcodeResponseSuccess {
    return !Object.prototype.hasOwnProperty.call(postcodeResponse, 'message');
  }
}
