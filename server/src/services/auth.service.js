import { generateToken } from '../utils/jwt.js';
import { hashPassword , comparePassword } from '../utils/bcrypt.js';
import { AUTH_ERROR_CONSTANTS } from '../constants/auth.constants.js';
import UserRepository from '../repositories/user.repository.js' 

export async function register({name,email,password}) {
    const existing=await UserRepository.findByEmail(email)
    if (existing){
        throw new Error(AUTH_ERROR_CONSTANTS.USER_ALREADY_EXISTS)
    }
    const hashedPassword=await hashPassword(password)
    const user=await UserRepository.create({name,email,password:hashedPassword})
    const userInfo= {id:user.id,name:user.name,email:user.email}
    return userInfo
}

export async function login({email,password}){
    const user= await UserRepository.findByEmail(email);
    if(!user){
        throw  new Error(AUTH_ERROR_CONSTANTS.INVALID_CREDENTIALS)
    }
    const valid= await comparePassword(password,user.password)
    if(!valid){
        throw new Error(AUTH_ERROR_CONSTANTS.INVALID_PASSWORD)
    }
    const userInfo= {id:user.id,name:user.name,email:user.email};
    const token = generateToken(userInfo);
    return {user : userInfo,token}
}

export async function google({token}){
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!res.ok) throw new Error('Invalid Google token');
    const {email, name} = await res.json();
    let user = await UserRepository.findByEmail(email);
    
    if (!user) {
        user = await UserRepository.create({name, email});
    }

    const userInfo = {id: user.id, name: user.name, email: user.email};
    const jwt_token = generateToken(userInfo);
    return {user: userInfo, token : jwt_token}
}