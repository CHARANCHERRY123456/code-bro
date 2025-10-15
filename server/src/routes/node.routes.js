import * as nodeController from '../controllers/node.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

import express from 'express';

const nodeRouter = express.Router();

nodeRouter.use(authMiddleware)
nodeRouter.post('/', nodeController.createNode);
nodeRouter.get('/', nodeController.list);
nodeRouter.get('/:nodeId', nodeController.fetchNode);
nodeRouter.patch('/:nodeId/content', nodeController.updateContent);
nodeRouter.patch('/:nodeId/name', nodeController.renameNode);

export default nodeRouter;