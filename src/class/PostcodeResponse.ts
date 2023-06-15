import {
  IPostCodeServiceRawResponse,
  IPostcodeResponseSuccess,
  IPostcodeResponseError,
} from '@src/interfaces/IPostcodeResponse';

export class PostcodeResponse {
  public static reshape(
    postcode: string,
    rawObject: IPostCodeServiceRawResponse,
  ): IPostcodeResponseSuccess {
    return {
      _id: postcode,
      admin_county: rawObject.result['admin_county'],
      admin_district: rawObject.result['admin_district'],
      admin_ward: rawObject.result['admin_ward'],
      ccg: rawObject.result['ccg'],
      country: rawObject.result['country'],
      date_of_introduction: rawObject.result['date_of_introduction'],
      eastings: rawObject.result['eastings'],
      european_electoral_region: rawObject.result['european_electoral_region'],
      incode: rawObject.result['incode'],
      latitude: rawObject.result['latitude'],
      longitude: rawObject.result['longitude'],
      nhs_ha: rawObject.result['nhs_ha'],
      northings: rawObject.result['northings'],
      nuts: rawObject.result['nuts'],
      outcode: rawObject.result['outcode'],
      parish: rawObject.result['parish'],
      parliamentary_constituency:
        rawObject.result['parliamentary_constituency'],
      pfa: rawObject.result['pfa'],
      postcode: rawObject.result['postcode'],
      primary_care_trust: rawObject.result['primary_care_trust'],
      quality: rawObject.result['quality'],
      region: rawObject.result['region'],
    };
  }

  public static generateErrorResponse(
    postcode: string,
    message = 'not found',
  ): IPostcodeResponseError {
    return {
      _id: postcode,
      message,
    };
  }
}
