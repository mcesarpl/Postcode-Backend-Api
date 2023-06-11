import { tokenGenerator } from '@src/services';

describe('Token Generator test', () => {
  it('Should import not to be undefined', () => {
    expect(tokenGenerator).not.toBeUndefined();
  });

  it('Should generate a token with 24 bytes', () => {
    const token = tokenGenerator.generateToken();

    expect(token).toHaveLength(24);
  });
});
