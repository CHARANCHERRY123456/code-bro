import * as inviteService from '../services/invite.serve.js'

export async function createInvite(req , res , next) {
    try {
        const ownerId = req.user.id;
        const {projectId} = req.params;
        const {expiresInDays} = req.body || {};
        const invite = await inviteService.createInvite(ownerId , Number(projectId) , expiresInDays || 7);
        res.status(201).json({success : true , data : invite});
    } catch (error) {
        next(error);
    }
}