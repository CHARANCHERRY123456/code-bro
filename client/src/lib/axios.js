import axios from "axios";
import { useSession } from "next-auth/react";

 
 



const api = axios.create({
    baseURL: "http://localhost:5000",
});

export default api;
