import { EnhancePostcodeResponse, Utils } from '@src/helpers';
import { Postcode, tokenGenerator } from '@src/services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LoggerFactory from '@src/factories/LoggerFactory';
import { CacheDatabaseFactory } from '@src/factories';
import { AddressRedisModel, sessionRedisModel } from '@src/models';
import {
  IPostcodeResponseEnhanced,
  IPostcodeResponseError,
  ISessionAddresses,
} from '@src/interfaces/IPostcodeResponse';

export class PostcodeController {
  constructor(
    private readonly log = LoggerFactory.get(),
    private readonly sessionDb = CacheDatabaseFactory.create<ISessionAddresses>(
      sessionRedisModel,
    ),
    private readonly postcodeDb = CacheDatabaseFactory.create<
      IPostcodeResponseEnhanced | IPostcodeResponseError
    >(AddressRedisModel),
  ) {}

  private async retrievePostcode(
    code: string,
  ): Promise<IPostcodeResponseEnhanced | IPostcodeResponseError> {
    let enhancedAddress = await this.postcodeDb.findOne(code);

    if (!enhancedAddress) {
      const postcode = new Postcode();

      const postcodeResponse = await postcode.getSingleCode(code);

      if (Utils.isPostcodeResponseSuccess(postcodeResponse)) {
        enhancedAddress =
          EnhancePostcodeResponse.addAirportDistance(postcodeResponse);
        await this.postcodeDb.create(enhancedAddress);
      }

      const error: IPostcodeResponseError =
        postcodeResponse as IPostcodeResponseError;

      await this.postcodeDb.create({ ...error });

      return error;
    }

    return enhancedAddress;
  }

  private async generateNewSession(
    enhancedAddress: IPostcodeResponseEnhanced | IPostcodeResponseError,
    session?: string,
  ) {
    let newSession = session;

    if (!newSession) {
      newSession = tokenGenerator.generateToken();
    }

    await this.sessionDb.create({
      _id: newSession,
      addresses: [enhancedAddress],
    });

    return newSession;
  }

  private async retrieveSession(
    session: string,
    enhancedAddress: IPostcodeResponseEnhanced | IPostcodeResponseError,
  ) {
    const retrievedSession = await this.sessionDb.findOne(session);

    if (!retrievedSession) {
      await this.generateNewSession(enhancedAddress, session);
      return [enhancedAddress];
    }

    const lastSearchs = retrievedSession.addresses;

    const newSessionAddress = [enhancedAddress, ...lastSearchs.slice(0, 2)];

    await this.sessionDb.updateOne({
      _id: session,
      addresses: newSessionAddress,
    });

    return newSessionAddress;
  }

  public async getAddress(request: Request, response: Response) {
    try {
      const { code } = request.params;

      if (!code) {
        return response.status(StatusCodes.OK).json();
      }

      let session = request.header('session');

      const enhancedAddress = await this.retrievePostcode(code);

      let finalResponse = [enhancedAddress];

      if (!session) {
        session = await this.generateNewSession(enhancedAddress);
      }

      finalResponse = await this.retrieveSession(session, enhancedAddress);

      response.set({
        session,
      });

      return response.status(StatusCodes.OK).json(finalResponse);
    } catch (error) {
      this.log.error((error as Error).stack);
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}
