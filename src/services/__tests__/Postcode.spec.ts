import { Postcode } from '../';
import postcodeServiceReshapedResponse from '@src/fixtures/postcodeServiceReshapedResponse.json';
import postcodeServiceArrayReshapedResponse from '@src/fixtures/postcodeServiceArrayReshapedResponse.json';

describe('Tests for Postcode service methods', () => {
  const postcode = new Postcode();

  it('should throw an Error when null, undefined or empty string passed', async () => {
    expect(postcode.getSingleCode(null as unknown as string)).rejects.toThrow(
      Error,
    );
    expect(
      postcode.getSingleCode(undefined as unknown as string),
    ).rejects.toThrow(Error);
    expect(postcode.getSingleCode('')).rejects.toThrow(Error);
  });

  it('should return an address based on single postcode passed', async () => {
    const result = await postcode.getSingleCode('N76RS');

    expect(result).toEqual(postcodeServiceReshapedResponse);
  });

  it('should throw an Error when null, undefined or empty array passed', async () => {
    expect(
      postcode.getMultipleCodes(null as unknown as Array<string>),
    ).rejects.toThrow(Error);
    expect(
      postcode.getMultipleCodes(undefined as unknown as Array<string>),
    ).rejects.toThrow(Error);
    expect(postcode.getMultipleCodes([])).rejects.toThrow(Error);
  });

  it('should return an array of addresses based on the postcodes passed', async () => {
    const result = await postcode.getMultipleCodes(['N76RS', 'SW46TA']);

    expect(result).toEqual(postcodeServiceArrayReshapedResponse);
  });
});
