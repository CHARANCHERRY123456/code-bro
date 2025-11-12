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

export async function getInviteInfo(req , res , next) {
    try {
        const token = req.params.token;
        const userId = req.user?.id;
        const info = await inviteService.getInviteInfo(token , userId);
        return res.json({success : true , data : info});
    } catch (err) {
        next(err)
    }
}