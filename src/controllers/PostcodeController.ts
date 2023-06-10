import { EnhancePostcodeResponse } from '@src/helpers';
import { Postcode } from '@src/services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LoggerFactory from '@src/factories/LoggerFactory';

export class PostcodeController {
  constructor(private readonly log = LoggerFactory.get()) {}

  public async getAddress(request: Request, response: Response) {
    try {
      const { code } = request.params;

      const postcode = new Postcode();

      const address = await postcode.getSingleCode(code);

      const enhancedAddress =
        EnhancePostcodeResponse.addAirportDistance(address);

      return response.status(StatusCodes.OK).json(enhancedAddress);
    } catch (error) {
      this.log.error((error as Error).stack);
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}
