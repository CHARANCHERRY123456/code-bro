import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET||'code-bro'

export function generateToken(data){
    return jwt.sign(data,JWT_SECRET,{expiresIn:'1h'})
}

export function verifyToken(token){
    return jwt.verify(token,JWT_SECRET);
}