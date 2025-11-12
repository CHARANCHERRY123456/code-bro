import express from 'express';
import * as inviteController from '../controllers/invite.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const InviteRouter = express.Router();

// have a prefix of /invite
InviteRouter.post("/:projectId/" , authMiddleware , inviteController.createInvite);

export default InviteRouter;