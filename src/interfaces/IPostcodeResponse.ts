export interface IPostcodeResponse {
  admin_county: null;
  admin_district: string;
  admin_ward: string;
  ccg: string;
  country: string;
  date_of_introduction: string;
  eastings: number;
  european_electoral_region: string;
  incode: string;
  latitude: number;
  longitude: number;
  nhs_ha: string;
  northings: number;
  nuts: string;
  outcode: string;
  parish: string;
  parliamentary_constituency: string;
  pfa: string;
  postcode: string;
  primary_care_trust: string;
  quality: number;
  region: string;
}

export interface IPostcodeResponseEnhanced {
  admin_county: null;
  admin_district: string;
  admin_ward: string;
  ccg: string;
  country: string;
  date_of_introduction: string;
  eastings: number;
  european_electoral_region: string;
  incode: string;
  latitude: number;
  longitude: number;
  nhs_ha: string;
  northings: number;
  nuts: string;
  outcode: string;
  parish: string;
  parliamentary_constituency: string;
  pfa: string;
  postcode: string;
  primary_care_trust: string;
  quality: number;
  region: string;
  distanceToAirport: {
    airportName: string;
    inKm: number;
    inMiles: number;
  };
}

export interface IPostCodeServiceRawResponse {
  result: {
    admin_county: null;
    admin_district: string;
    admin_ward: string;
    ccg: string;
    ced: null;
    codes: {
      admin_county: string;
      admin_district: string;
      admin_ward: string;
      ccg: string;
      ccg_id: string;
      ced: string;
      lau2: string;
      lsoa: string;
      msoa: string;
      nuts: string;
      parish: string;
      parliamentary_constituency: string;
      pfa: string;
    };
    country: string;
    date_of_introduction: string;
    eastings: number;
    european_electoral_region: string;
    incode: string;
    latitude: number;
    longitude: number;
    lsoa: string;
    msoa: string;
    nhs_ha: string;
    northings: number;
    nuts: string;
    outcode: string;
    parish: string;
    parliamentary_constituency: string;
    pfa: string;
    postcode: string;
    primary_care_trust: string;
    quality: number;
    region: string;
  };
  status: number;
}

export interface sessionAddresses {
  addresses: IPostcodeResponseEnhanced[];
}
