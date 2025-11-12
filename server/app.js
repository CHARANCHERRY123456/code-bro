import express from 'express';
import errorHandler from './src/middlewares/error.middleware.js';
import authRouter from './src/routes/auth.routes.js';
import ProjectRouter from './src/routes/project.routes.js';
import nodeRouter from './src/routes/node.routes.js';
import inviteRouter from './src/routes/invite.routes.js'
import morgan from 'morgan';
import cors from 'cors'
const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());
app.use(morgan("dev"))
app.use("/auth" , authRouter);
app.use("/project" , ProjectRouter);
app.use("/node" , nodeRouter);
app.use("/invite" , inviteRouter);

app.get("/health" , (req , res)=>{
    res.send("Totally working fine bro");
})


app.use(errorHandler);


export default app;