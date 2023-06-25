import { ExpressServer } from '@src/services';

class ServerFactory {
  public server!: ExpressServer;

  public create() {
    if (!this.server) {
      this.server = new ExpressServer();
      this.server.start();
    }

    return this.server;
  }
}

export const Server = new ServerFactory();
