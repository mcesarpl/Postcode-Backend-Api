import { IHttpClient } from '@src/interfaces';
import axios from 'axios';

export class AxiosAdapter implements IHttpClient {
  async get<T>(url: string) {
    const result = await axios.get<T>(url);
    return { statusCode: result.status, body: result.data };
  }
}
