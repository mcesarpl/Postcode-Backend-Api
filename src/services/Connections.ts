import { ElasticServerFactory } from '@src/factories';
import config, { IConfig } from 'config';
import { Client } from 'elasticsearch';
import { RedisClientType, createClient } from 'redis';

class Connections {
  private elasticSearchClient!: Client;
  private redisClient!: RedisClientType;

  public async startDatabaseConnections(): Promise<void> {
    if (!this.elasticSearchClient) {
      await this.startElasticSearchConnection();
    }

    if (!this.redisClient) {
      await this.startRedisConnection();
    }
  }

  public async closeConnections(): Promise<void> {
    if (this.elasticSearchClient) {
      this.elasticSearchClient.close();
    }

    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }

  public getConnections() {
    return {
      elasticSearch: this.elasticSearchClient,
      redis: this.redisClient,
    };
  }

  private async startElasticSearchConnection(): Promise<void> {
    const elasticServer = ElasticServerFactory.create();
    await elasticServer.start();
    this.elasticSearchClient = elasticServer.get();
  }

  private async startRedisConnection(): Promise<void> {
    const dbConfig: IConfig = config.get('App.databases');

    this.redisClient = createClient({
      url: dbConfig.get('redis.url'),
    });

    await this.redisClient.connect();
  }
}

export default new Connections();
