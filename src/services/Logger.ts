import { createLogger, format, transports } from 'winston';
import {
  ElasticsearchTransport,
  ElasticsearchTransformer,
  LogData,
} from 'winston-elasticsearch';
import moment from 'moment';
import config, { IConfig } from 'config';

export class Logger {
  create() {
    const dbConfig: IConfig = config.get('App.databases');

    const { combine, colorize, printf } = format;

    const { Console } = transports;

    const myFormat = printf(({ level, message }) => {
      return `${moment()
        .format('YYYY-MM-DD HH:mm:ss')
        .trim()} [${level}] - ${message}`;
    });

    const winstonLogger = createLogger({
      level: 'debug',
    });

    const errorStackFormat = format((info) => {
      if (info.stack) {
        return false;
      }
      return info;
    });

    const consoleTransport = new Console({
      format: combine(colorize(), errorStackFormat(), myFormat),
    });

    const esTransportOpts = {
      level: 'error',
      transformer: (logData: LogData) => {
        const transformed = ElasticsearchTransformer(logData);
        return transformed;
      },
      clientOpts: { node: `${dbConfig.get('elastic')}` },
    };

    const esTransport = new ElasticsearchTransport(esTransportOpts);

    winstonLogger.add(consoleTransport);

    winstonLogger.add(esTransport);

    return winstonLogger;
  }
}
