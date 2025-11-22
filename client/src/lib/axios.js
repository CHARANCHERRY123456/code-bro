import axios from "axios";
import { useSession } from "next-auth/react";

 
 



const api = axios.create({
    baseURL: "https://code-bro-chz1.onrender.com",
});

export default api;
