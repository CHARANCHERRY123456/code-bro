import express, { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import projectController from '../controllers/project.controller.js';
import { OwnerCheckMiddleware } from '../middlewares/project.middleware.js';

const ProjectRouter = express.Router();

ProjectRouter.use(authMiddleware);

ProjectRouter.post('/' ,projectController.create );
ProjectRouter.get('/',projectController.list)
ProjectRouter.get('/:projectId',projectController.details)
ProjectRouter.patch("/:projectId" ,OwnerCheckMiddleware ,  projectController.update)
ProjectRouter.delete("/:projectId" ,OwnerCheckMiddleware, projectController.deleteProject);

// Project Memebers
ProjectRouter.post("/:projectId/members",OwnerCheckMiddleware , projectController.addMember);


export default ProjectRouter;