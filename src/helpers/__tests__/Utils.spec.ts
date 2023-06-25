import {
  IPostcodeResponse,
  IPostcodeResponseError,
} from '@src/interfaces/IPostcodeResponse';
import { Utils } from '..';

describe('Utils methods tests', () => {
  it('should test notEmpty method', () => {
    expect(Utils.notNullNotUndefined<undefined>(undefined)).toBeFalsy();
    expect(Utils.notNullNotUndefined<null>(null)).toBeFalsy();
    expect(Utils.notNullNotUndefined<unknown>({})).toBeTruthy();
    expect(Utils.notNullNotUndefined<Array<null>>([])).toBeTruthy();
  });

  it('should test isPostcodeResponse to verify is isPostcodeResponseSuccess', () => {
    const postcodeResponse = {} as IPostcodeResponse;
    const postcodeResponseError = {
      message: 'not found',
    } as IPostcodeResponseError;

    expect(Utils.isPostcodeResponseSuccess(postcodeResponse)).toBeTruthy();
    expect(Utils.isPostcodeResponseSuccess(postcodeResponseError)).toBeFalsy();
  });
});
