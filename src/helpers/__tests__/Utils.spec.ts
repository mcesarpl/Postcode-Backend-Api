import { Utils } from '..';

describe('Utils methods tests', () => {
  it('should test notEmpty method', () => {
    expect(Utils.notNullNotUndefined<undefined>(undefined)).toBeFalsy();
    expect(Utils.notNullNotUndefined<null>(null)).toBeFalsy();
    expect(Utils.notNullNotUndefined<unknown>({})).toBeTruthy();
    expect(Utils.notNullNotUndefined<Array<null>>([])).toBeTruthy();
  });
});
