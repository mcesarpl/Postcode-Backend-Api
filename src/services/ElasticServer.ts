import { Client } from 'elasticsearch';
import config, { IConfig } from 'config';

export class ElasticServer {
  public client!: Client;
  private readonly elasticServerHost: IConfig = config.get('App.databases');

  private async ping(): Promise<void> {
    try {
      await this.client.ping({
        requestTimeout: 1000,
      });
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  public async start(): Promise<void> {
    this.client = new Client({
      host: this.elasticServerHost.get('elastic'),
      log: 'trace',
    });

    await this.ping();
  }

  public get(): Client {
    return this.client;
  }
}
