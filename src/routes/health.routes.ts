import express, { Request, Response } from 'express';

class HealthCheckerRoute {
  public static create() {
    const router = express.Router();

    router.get('/', (_: Request, response: Response) => {
      return response.status(200).send();
    });

    return router;
  }
}

export default HealthCheckerRoute;
