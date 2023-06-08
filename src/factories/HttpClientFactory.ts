import { AxiosAdapter } from '@src/adapters/AxiosAdapter';

export class HttpClientFactory {
  public static create() {
    return new AxiosAdapter();
  }
}
