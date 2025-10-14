import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserRepository from '../repositories/user.repository.js' 

const JWT_SECRET=process.env.JWT_SECRET||'code-bro'

export async function register({name,email,password}) {
    const existing=await UserRepository.findByEmail(email)
    if (existing){
        throw new Error('User already exists')
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const user=await UserRepository.create({name,email,password:hashedPassword})
    const userInfo= {id:user.id,name:user.name,email:user.email}
    return userInfo
}

