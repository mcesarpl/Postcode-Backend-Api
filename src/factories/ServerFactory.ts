import { ExpressServer } from '@src/services';

export class ServerFactory {
  public static create() {
    return new ExpressServer();
  }
}
