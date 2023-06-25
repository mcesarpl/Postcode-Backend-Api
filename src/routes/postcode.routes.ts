import { PostcodeController } from '@src/controllers';
import express, { Request, Response } from 'express';

class PostCodeRoute {
  public static create() {
    const router = express.Router();

    const postcodeController = new PostcodeController();

    router.get('/:code', (request: Request, response: Response) =>
      postcodeController.getAddress(request, response),
    );

    return router;
  }
}

export default PostCodeRoute;
