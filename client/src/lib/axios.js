import axios from "axios";
import { useSession } from "next-auth/react";

 
 



const api = axios.create({
    baseURL: "https://codebro-kgqz.onrender.com",
});

export default api;
