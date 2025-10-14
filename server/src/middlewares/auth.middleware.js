import {AUTH_ERROR_CONSTANTS} from '../constants/auth.constants.js';
import { verifyToken } from '../utils/jwt.js';

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: AUTH_ERROR_CONSTANTS.MISSING_AUTH_HEADER });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: AUTH_ERROR_CONSTANTS.TOKEN_INVALID });
    }
}
