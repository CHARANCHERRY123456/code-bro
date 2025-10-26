import express from 'express';
import * as authController from '../controllers/auth.controller.js'
const authRouter = express.Router();


authRouter.post("/register" ,authController.register);
authRouter.post("/login" ,authController.login);
authRouter.post("/google", authController.google);


export default authRouter;