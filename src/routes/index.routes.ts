import express from 'express';
import HealthCheckerRoute from './health.routes';

class createRoutes {
  public static getRouter() {
    const router = express.Router();

    router.use('/health', HealthCheckerRoute.create());

    return router;
  }
}

export default createRoutes;
