import config, { IConfig } from 'config';
import { ServerFactory } from '@src/factories';
import Connections from './Connections';

export class Initializer {
  public static async start(): Promise<void> {
    try {
      const configPort: IConfig = config.get('App.port');

      await Connections.startDatabaseConnections();

      const server = ServerFactory.create();
      server.start();

      console.log(`Server is listening at port ${configPort}...`);
    } catch (error) {
      console.error((error as Error)?.stack);
    }
  }
}
