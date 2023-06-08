import { ElasticServerFactory } from '@src/factories';
import { Client } from 'elasticsearch';

class Connections {
  private elasticSearchClient!: Client;

  public async startDatabaseConnections(): Promise<void> {
    if (!this.elasticSearchClient) {
      await this.startElasticSearchConnection();
    }
  }

  public async closeConnections(): Promise<void> {
    if (this.elasticSearchClient) {
      this.elasticSearchClient.close();
    }
  }

  public getConnections() {
    return {
      elasticSearch: this.elasticSearchClient,
    };
  }

  private async startElasticSearchConnection(): Promise<void> {
    const elasticServer = ElasticServerFactory.create();
    await elasticServer.start();
    this.elasticSearchClient = elasticServer.get();
  }
}

export default new Connections();
