import Connections from '@src/services/Connections';
import {
  RedisClient,
  RedisModel,
} from '@src/adapters/CacheDatabaseAdapters/RedisClientAdapter';

export class CacheDatabaseFactory {
  public static create<T>(model: RedisModel) {
    const { redis } = Connections.getConnections();

    return new RedisClient<T>(redis, model);
  }
}
