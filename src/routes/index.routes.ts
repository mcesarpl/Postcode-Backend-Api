import express from 'express';

class createRoutes {
  public static getRouter() {
    const router = express.Router();

    router.use('/health', (_, response) => {
      return response.status(200).send();
    });

    return router;
  }
}

export default createRoutes;
