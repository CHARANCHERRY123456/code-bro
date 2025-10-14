import express from 'express';
import errorHandler from './src/middlewares/error.middleware.js';
import authRouter from './src/routes/auth.routes.js';
const app = express();

app.use(express.json());
app.use("/auth" , authRouter);


app.use(errorHandler);


export default app;