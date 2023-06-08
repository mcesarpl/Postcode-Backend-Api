import { IHttpResponse } from './IHttpResponse';

export interface IHttpClient {
  get<T>(url: string): Promise<IHttpResponse<T>>;
}
