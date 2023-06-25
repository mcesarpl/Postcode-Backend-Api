import { RedisClient } from '@src/adapters/CacheDatabaseAdapters/RedisClientAdapter';

import { createClient, RedisClientType } from 'redis';
import { tokenGenerator } from '@src/services';

import postcodeResponseEnhancedWithAirportDistance from '@src/fixtures/postcodeResponseEnhancedWithAirportDistance.json';
import {
  IPostcodeResponseEnhanced,
  ISessionAddresses,
} from '@src/interfaces/IPostcodeResponse';
import { AddressRedisModel, sessionRedisModel } from '@src/models';

describe('Redis Client methods test', () => {
  const postCodeResponseEnhanced = postcodeResponseEnhancedWithAirportDistance;

  const postCodeResponseEnhancedSecond = {
    ...postcodeResponseEnhancedWithAirportDistance,
    _id: 'NJUHYO',
  };

  const session = {
    _id: tokenGenerator.generateToken(),
    addresses: [
      postcodeResponseEnhancedWithAirportDistance,
      postcodeResponseEnhancedWithAirportDistance,
      postcodeResponseEnhancedWithAirportDistance,
    ],
  };

  let client: RedisClientType;

  beforeAll(async () => {
    client = createClient({
      url: 'redis://localhost:6379',
    });

    await client.connect();
  });

  afterAll(async () => {
    await client.quit();
  });

  it('Should create a postCodeResponseEnhanced instance and return', async () => {
    const redisClient = new RedisClient<IPostcodeResponseEnhanced>(
      client,
      AddressRedisModel,
    );
    jest.spyOn(redisClient, 'deleteOne');

    const result = await redisClient.create(postCodeResponseEnhanced);

    await redisClient.deleteOne(postCodeResponseEnhanced._id);

    expect(result).toEqual(postCodeResponseEnhanced);

    expect(redisClient.deleteOne).toBeCalledTimes(1);
  });

  it('Should create a sessionAddresses instance and return', async () => {
    const redisClient = new RedisClient<ISessionAddresses>(
      client,
      sessionRedisModel,
    );

    jest.spyOn(redisClient, 'deleteOne');

    const result = await redisClient.create(session);

    await redisClient.deleteOne(session._id);

    expect(result).toEqual(session);

    expect(redisClient.deleteOne).toBeCalledTimes(1);
  });

  it('Should find one postCodeResponseEnhanced instance and return it', async () => {
    const redisClient = new RedisClient<IPostcodeResponseEnhanced>(
      client,
      AddressRedisModel,
    );

    await redisClient.create(postCodeResponseEnhanced);

    const result = await redisClient.findOne(postCodeResponseEnhanced._id);

    await redisClient.deleteOne(postCodeResponseEnhanced._id);

    expect(result).toEqual(postCodeResponseEnhanced);
  });

  it('Should find one sessionAddresses instance and return it', async () => {
    const redisClient = new RedisClient<ISessionAddresses>(
      client,
      sessionRedisModel,
    );

    await redisClient.create(session);

    const result = await redisClient.findOne(session._id);

    await redisClient.deleteOne(session._id);

    expect(result).toEqual(session);
  });

  it('Should find all instances of one type and return then', async () => {
    const redisResponseClient = new RedisClient<IPostcodeResponseEnhanced>(
      client,
      AddressRedisModel,
    );

    const redisSessionClient = new RedisClient<ISessionAddresses>(
      client,
      sessionRedisModel,
    );

    await redisResponseClient.create(postCodeResponseEnhanced);

    await redisSessionClient.create(session);

    const responseResult = await redisResponseClient.find({});

    const sessionResult = await redisSessionClient.find({});

    await redisResponseClient.deleteOne(postCodeResponseEnhanced._id);

    await redisSessionClient.deleteOne(session._id);

    expect(responseResult).toEqual(
      expect.arrayContaining([postCodeResponseEnhanced]),
    );

    expect(sessionResult).toEqual(expect.arrayContaining([session]));
  });

  it('Should find all instances with specific postcode', async () => {
    const redisClient = new RedisClient<IPostcodeResponseEnhanced>(
      client,
      AddressRedisModel,
    );

    await redisClient.create(postCodeResponseEnhanced);

    await redisClient.create(postCodeResponseEnhancedSecond);

    const result = await redisClient.find({
      _id: postCodeResponseEnhanced._id,
    });

    await redisClient.deleteOne(postCodeResponseEnhanced._id);

    await redisClient.deleteOne(postCodeResponseEnhancedSecond._id);

    expect(result).toEqual([postCodeResponseEnhanced]);
  });

  it('Should update an instance with success', async () => {
    const redisClient = new RedisClient<ISessionAddresses>(
      client,
      sessionRedisModel,
    );

    const modifiedUser = {
      ...session,
      addresses: [
        ...session.addresses,
        postcodeResponseEnhancedWithAirportDistance,
      ],
    };

    const result = await redisClient.updateOne(modifiedUser);

    await redisClient.deleteOne(modifiedUser._id);

    expect(result).toEqual(modifiedUser);
  });
});
