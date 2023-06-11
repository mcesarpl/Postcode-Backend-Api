import { AxiosAdapter } from '@src/adapters/HttpClientAdapters/AxiosAdapter';

export class HttpClientFactory {
  public static create() {
    return new AxiosAdapter();
  }
}
