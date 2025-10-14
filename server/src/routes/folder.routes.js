import * as folderController from '../controllers/folder.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

import express from 'express';

const folderRouter = express.Router();

folderRouter.use(authMiddleware)
folderRouter.post('/', folderController.createFolder);
folderRouter.get('/', folderController.list);

export default folderRouter;