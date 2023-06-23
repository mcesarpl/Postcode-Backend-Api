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
  Logger,
} from '@src/interfaces';

export class PostcodeController {
  constructor(
    private readonly log: Logger = LoggerFactory.get(),
    private readonly httpPostcode: Postcode = new Postcode(),
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

    if (enhancedAddress) {
      return enhancedAddress;
    }

    const postcodeResponse = await this.httpPostcode.getSingleCode(code);

    if (!Utils.isPostcodeResponseSuccess(postcodeResponse)) {
      const error: IPostcodeResponseError =
        postcodeResponse as IPostcodeResponseError;

      try {
        await this.postcodeDb.create(error);
      } catch (postcodeDbError) {
        this.log.warn(
          `on postcodeDb.create: data: ${error}\nerror:${postcodeDbError}`,
        );
      }

      return error;
    }

    enhancedAddress =
      EnhancePostcodeResponse.addAirportDistance(postcodeResponse);

    try {
      await this.postcodeDb.create(enhancedAddress);
    } catch (postcodeDbError) {
      this.log.warn(
        `on postcodeDb.create: data: ${JSON.stringify(
          enhancedAddress,
        )}\nerror:${postcodeDbError}`,
      );
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

    try {
      await this.sessionDb.create({
        _id: newSession,
        addresses: [enhancedAddress],
      });
    } catch (error) {
      this.log.warn(
        `on sessionDb.create: session: ${newSession}\nerror:${error}`,
      );
    }

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

    try {
      await this.sessionDb.updateOne({
        _id: session,
        addresses: newSessionAddress,
      });
    } catch (error) {
      this.log.warn(
        `on sessionDb.updateOne: session: ${session}\nerror:${error}`,
      );
    }

    return newSessionAddress;
  }

  public async getAddress(request: Request, response: Response) {
    try {
      const { code } = request.params;

      if (!code || code.length === 0) {
        return response.status(StatusCodes.OK).json();
      }

      const enhancedAddress = await this.retrievePostcode(code);

      let finalResponse = [enhancedAddress];

      let session = request.header('session');

      if (session && session.length !== 0) {
        finalResponse = await this.retrieveSession(session, enhancedAddress);
      } else {
        session = await this.generateNewSession(enhancedAddress);
      }

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
