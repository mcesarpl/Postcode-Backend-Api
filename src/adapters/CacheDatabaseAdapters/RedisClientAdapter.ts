import { Utils } from '@src/helpers';
import { IDatabase } from '@src/interfaces';
import config from 'config';

import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

export interface RedisInstance<T> {
  key: string;
  type: string;
  lookupParams?: object;
  instance: T;
}

export interface RedisKey {
  key: string;
  type: string;
  lookupParams?: object;
}

export interface RedisModel {
  type: string;
  lookupParams?: string[];
}

export class RedisClient<T> implements IDatabase<T, T | null> {
  constructor(
    private readonly client: RedisClientType<
      RedisDefaultModules & RedisModules,
      RedisFunctions,
      RedisScripts
    >,
    private readonly redisModel: RedisModel,
    private readonly expirationTime: string = config.get(
      'App.databases.redis.expiration',
    ),
  ) {
    this.redisModel = redisModel;
  }

  async create(inputInstance: T & { _id?: string }) {
    const redisInstance = this.forgeRedisInstance(inputInstance);

    const { key, type, lookupParams, instance } = redisInstance;

    const generatedKey = this.generateKey(key, type, lookupParams);

    const stringified = this.stringifyInstance(instance);

    const result = await this.client.set(generatedKey, stringified, {
      EX: Number(this.expirationTime) | 3600,
      NX: true,
    });

    if (result !== 'OK') {
      throw new Error(
        `RedisClientAdapter: Error when creating instance: ${JSON.stringify(
          inputInstance,
        )}, redisResult: ${result}`,
      );
    }

    return instance;
  }

  async updateOne(inputInstance: T & { _id: string }) {
    const oldInstance = await this.findOne(inputInstance._id);

    const finalOldInstance = oldInstance ? oldInstance : {};

    const redisInstance = this.forgeRedisInstance({
      ...finalOldInstance,
      ...inputInstance,
    });

    const { key, type, lookupParams, instance } = redisInstance;
    const generatedKey = this.generateKey(key, type, lookupParams);
    const stringified = this.stringifyInstance(instance);

    if (oldInstance) {
      await this.deleteOne(inputInstance._id);
    }

    const result = await this.client.set(generatedKey, stringified, {
      EX: Number(this.expirationTime) ?? 3600,
    });

    if (result !== 'OK') {
      throw new Error(
        `Error when updating instance: ${JSON.stringify(inputInstance)}`,
      );
    }

    return instance;
  }

  async findOne(instanceId: string) {
    const finalKeyString = this.generateFinalKeyString({ key: instanceId });

    const keys = await this.client.keys(finalKeyString);

    if (!keys || keys.length === 0) {
      return null;
    }

    const instance = await this.client.get(keys[0]);

    const parsedInstance = this.parseInstance(instance);

    if (!parsedInstance) {
      return null;
    }

    return parsedInstance;
  }

  async find(query: object) {
    const lookupParams = this.generateLookupParams(query);

    const finalQuery = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      key: (query as any)._id,
      type: this.redisModel?.type,
      lookupParams: lookupParams,
    };

    const finalKeyString = this.generateFinalKeyString(finalQuery);

    const keys = await this.client.keys(finalKeyString);

    if (!keys) {
      return [];
    }

    const values = (
      await Promise.all(
        keys.map(async (key) => {
          const instance = await this.client.get(key);
          return this.parseInstance(instance);
        }),
      )
    ).filter(Utils.notNullNotUndefined);

    return values;
  }

  async deleteOne(instanceId: string) {
    const finalKeyString = this.generateFinalKeyString({ key: instanceId });

    const keys = await this.client.keys(finalKeyString);

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return;
    }

    const instance = await this.client.get(keys[0]);

    const parsedInstance = this.parseInstance(instance);

    if (!parsedInstance) {
      return;
    }

    const redisInstance = this.forgeRedisInstance(parsedInstance);

    const { key, type, lookupParams } = redisInstance;
    const generatedKey = this.generateKey(key, type, lookupParams);
    await this.client.del(generatedKey);
  }

  private generateFinalKeyString(query: Partial<RedisKey>) {
    const { key, type, lookupParams } = query;

    const stringLookupParams = this.lookupParamsToString(lookupParams);

    const finalLookupParams =
      stringLookupParams.length > 0 ? stringLookupParams : '';

    const typeString = type ? type : '';

    const keyString = key ? key : '';

    return `${typeString}*${keyString}*${finalLookupParams}*`;
  }

  private lookupParamsToString(lookupParams?: object): string {
    if (lookupParams && Object.values(lookupParams).length > 0) {
      const values = Object.values(lookupParams);
      return values.join('-');
    }

    return '';
  }

  private generateKey(
    key: string,
    type: string,
    lookupParams?: object,
  ): string {
    const stringLookupParams = this.lookupParamsToString(lookupParams);
    const finalLookupParams =
      stringLookupParams.length > 0 ? `-${stringLookupParams}` : '';
    return type + '-' + key + finalLookupParams;
  }

  private stringifyInstance(instance: T): string {
    return JSON.stringify(instance);
  }

  private parseInstance(instance: string | null): T | null {
    if (!instance) {
      return null;
    }
    return JSON.parse(instance);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private generateLookupParams(instance: any) {
    if (!(instance instanceof Object) || instance === null) {
      return instance;
    }

    return this.redisModel.lookupParams?.reduce((accumulator, param) => {
      return {
        ...accumulator,
        [param]: param in instance ? instance[param] : '',
      };
    }, {});
  }

  private forgeRedisInstance(instance: T): RedisInstance<T> {
    const lookupParams = this.generateLookupParams(instance);
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      key: (instance as any)._id,
      type: this.redisModel?.type,
      lookupParams: lookupParams,
      instance: instance,
    };
  }
}
