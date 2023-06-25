import { Logger } from '@src/services/Logger';
import { Logger as winstonLogger } from 'winston';

class LoggerFactory {
  public initialedLogger!: winstonLogger;
  start(): void {
    this.initialedLogger = Logger.create();
  }

  get(): winstonLogger {
    if (!this.initialedLogger) {
      this.start();
    }
    return this.initialedLogger;
  }

  close(): void {
    if (this.initialedLogger) {
      this.initialedLogger.end();
    }
  }
}

export default new LoggerFactory();
