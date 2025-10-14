import express from 'express';
import * as authController from '../controllers/auth.controller.js'
const authRouter = express.Router();


authRouter.post("/register" ,authController.register);

export default authRouter;