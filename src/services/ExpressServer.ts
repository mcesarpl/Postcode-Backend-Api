import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import createRouter from '@src/routes/index.routes';
import config from 'config';

export class ExpressServer {
  private app = express();
  private port = config.get('App.port');

  middleware() {
    const whitelist = ['https://localhost'];

    const corsOptions: cors.CorsOptions = {
      origin: whitelist,
    };

    const apiLimiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 120,
      statusCode: StatusCodes.TOO_MANY_REQUESTS,
      message: ReasonPhrases.TOO_MANY_REQUESTS,
    });

    this.app.use(cors(corsOptions));
    this.app.use(express.json());

    this.app.use('/', apiLimiter);
  }

  routes() {
    const initializeRoutes = createRouter.getRouter();
    this.app.use(initializeRoutes);
  }

  start() {
    this.middleware();
    this.routes();
    this.app.listen(this.port);
  }

  get() {
    return this.app;
  }
}
