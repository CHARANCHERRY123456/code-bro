import express from 'express';
import errorHandler from './src/middlewares/error.middleware.js';
import authRouter from './src/routes/auth.routes.js';
import ProjectRouter from './src/routes/project.routes.js';
import folderRouter from './src/routes/folder.routes.js';
const app = express();

app.use(express.json());
app.use("/auth" , authRouter);
app.use("/project" , ProjectRouter);
app.use("/folder" , folderRouter);


app.use(errorHandler);


export default app;