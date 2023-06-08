import config, { IConfig } from 'config';
import { ServerFactory } from '@src/factories';

export class Initializer {
  public static async start(): Promise<void> {
    try {
      const configPort: IConfig = config.get('App.port');

      const server = ServerFactory.create();
      await server.start();

      console.log(`Server is listening at port ${configPort}...`);
    } catch (error) {
      console.error((error as Error)?.stack);
    }
  }
}
