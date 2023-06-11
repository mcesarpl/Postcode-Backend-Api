import { Logger } from '@src/services';
import { Logger as winstonLogger } from 'winston';

class LoggerFactory {
  public initialedLogger!: winstonLogger;
  start(): void {
    this.initialedLogger = new Logger().create();
  }

  get(): winstonLogger {
    if (!this.initialedLogger) {
      this.start();
    }
    return this.initialedLogger;
  }
}

export default new LoggerFactory();
