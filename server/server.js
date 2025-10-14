import dotenv from 'dotenv';
import app from './app.js';
dotenv.config();


const PORT = process.env.PORT || 3000

app.listen(PORT , (req , res)=>{
    console.log("server running in the on the port" , PORT);
})