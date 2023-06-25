import { RedisClient } from '@src/adapters/CacheDatabaseAdapters/RedisClientAdapter';
import { Server } from '@src/factories';
import postcodeResponseEnhancedWithAirportDistance from '@src/fixtures/postcodeResponseEnhancedWithAirportDistance.json';
import postcodeResponseNotFound from '@src/fixtures/postcodeServiceNotFoundResponse.json';
import { IPostcodeResponseEnhanced, ISessionAddresses } from '@src/interfaces';
import { AddressRedisModel, sessionRedisModel } from '@src/models';
import Connections from '@src/services/Connections';
import supertest from 'supertest';

describe('Postcode Routes functional tests', () => {
  let superTest: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await Connections.startDatabaseConnections();
    const server = Server.create();
    superTest = supertest(server.get());
  });

  afterAll(async () => {
    const { redis } = await Connections.getConnections();

    const redisClient = new RedisClient<IPostcodeResponseEnhanced>(
      redis,
      AddressRedisModel,
    );

    const redisSessionClient = new RedisClient<ISessionAddresses>(
      redis,
      sessionRedisModel,
    );

    await redisClient.deleteOne('N76RS');
    await redisClient.deleteOne('NOTFOUND');

    await redisSessionClient.deleteOne('*');
  });

  it('should return an address with the distance to the airport', async () => {
    const response = await superTest.get('/postcode/N76RS');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([
      postcodeResponseEnhancedWithAirportDistance,
    ]);
  });

  it('should not return an address when passing a valid one with slight difference', async () => {
    const response = await superTest.get('/postcode/N76R');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([
      { ...postcodeResponseNotFound, _id: 'N76R' },
    ]);
  });

  it('should return an address not found when passed an invalid postcode', async () => {
    const response = await superTest.get('/postcode/NOTFOUND');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([postcodeResponseNotFound]);
  });

  it('should first return an address with session, after should return up to 3 last answers', async () => {
    const response = await superTest.get('/postcode/N76RS');
    expect(response.status).toBe(200);
    expect(response.headers.session).not.toBeNull();
    expect(response.body).toEqual([
      postcodeResponseEnhancedWithAirportDistance,
    ]);

    const session = response.headers.session;

    const secondResponse = await superTest
      .get('/postcode/N76RS')
      .set('session', session);
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers.session).not.toBeNull();
    expect(secondResponse.body).toEqual(
      expect.arrayContaining([
        postcodeResponseEnhancedWithAirportDistance,
        postcodeResponseEnhancedWithAirportDistance,
      ]),
    );

    const thirdResponse = await superTest
      .get('/postcode/NOTFOUND')
      .set('session', session);
    expect(thirdResponse.status).toBe(200);
    expect(thirdResponse.headers.session).not.toBeNull();
    expect(thirdResponse.body).toEqual(
      expect.arrayContaining([
        postcodeResponseEnhancedWithAirportDistance,
        postcodeResponseEnhancedWithAirportDistance,
        postcodeResponseNotFound,
      ]),
    );
  });
});
