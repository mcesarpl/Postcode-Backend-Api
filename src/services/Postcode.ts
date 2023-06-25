import { PostcodeResponse } from '@src/class/PostcodeResponse';
import { HttpClientFactory } from '@src/factories/HttpClientFactory';
import {
  IPostCodeServiceRawResponse,
  IPostcodeResponse,
} from '@src/interfaces/IPostcodeResponse';
import config from 'config';

export class Postcode {
  constructor(
    private readonly httpClient = HttpClientFactory.create(),
    private readonly postCodeServiceUrl = config.get('App.postcodeServiceUrl'),
  ) {}

  public async getSingleCode(postcode: string): Promise<IPostcodeResponse> {
    if (!postcode || postcode === '') {
      throw new Error(`getSingleCode received: ${postcode}`);
    }

    try {
      const result = await this.httpClient.get<IPostCodeServiceRawResponse>(
        `${this.postCodeServiceUrl}/${postcode}`,
      );

      return PostcodeResponse.reshape(postcode, result.body);
    } catch (error) {
      return PostcodeResponse.generateErrorResponse(postcode);
    }
  }

  public async getMultipleCodes(postcodes: string[]) {
    if (!postcodes || !Array.isArray(postcodes) || postcodes.length === 0) {
      throw new Error(`getMultipleCodes received: ${postcodes}`);
    }

    return await Promise.all(
      postcodes.map(async (postcode) => {
        try {
          const result = await this.httpClient.get<IPostCodeServiceRawResponse>(
            `${this.postCodeServiceUrl}/${postcode}`,
          );

          return PostcodeResponse.reshape(postcode, result.body);
        } catch (error) {
          return PostcodeResponse.generateErrorResponse(postcode);
        }
      }),
    );
  }
}
