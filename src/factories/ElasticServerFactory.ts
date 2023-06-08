import { ElasticServer } from '@src/services/ElasticServer';

export class ElasticServerFactory {
  public static create() {
    return new ElasticServer();
  }
}
