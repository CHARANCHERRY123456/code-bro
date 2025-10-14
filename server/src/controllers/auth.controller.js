import * as authService from '../services/auth.service.js';

export async function register(req,res,next) {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({success : true,data : user})
    } catch (error) {
        next(error)
    }
}

