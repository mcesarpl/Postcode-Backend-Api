import express from 'express';
import HealthCheckerRoute from './health.routes';
import PostCodeRoute from './postcode.routes';

class createRoutes {
  public static getRouter() {
    const router = express.Router();

    const postCodeRoute = PostCodeRoute.create();

    router.use('/health', HealthCheckerRoute.create());
    router.use('/postcode', postCodeRoute);

    return router;
  }
}

export default createRoutes;
