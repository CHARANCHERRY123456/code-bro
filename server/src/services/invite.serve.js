import { randomUUID } from "crypto";
import projectRepository from "../repositories/project.repository.js";
import ProjecInviteRepository from "../repositories/projectinvite.repository.js";
import ProjectJoinRequestRepository from "../repositories/project.invite.repository.js";

import userRepository from "../repositories/user.repository.js";
import sendMail from "../utils/mailer.js";
import projectInviteRepository from "../repositories/projectinvite.repository.js";
import projectMemberRepository from "../repositories/project.member.repository.js";

export async function createInvite(ownerId, projectId, expiresInDays=7) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }
    if(project.ownerId !== ownerId){
        throw new Error("Only project owner can create invites");
    }

    const token = randomUUID();
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null;

    const invite = await projectInviteRepository.create({
        token , projectId , createdBy : ownerId , expiresAt , isActive : true
    })

    return invite;
}

// gives all the details about infor like which project,user,owner
export async function getInviteInfo(token , userId=null) {
    const invite = await projectInviteRepository.findByToken(token);
    if (!invite || !invite.isActive) {
        throw new Error("Invalid or inactive invite token");
    }
    if (invite.expiresAt && invite.expiresAt < new Date()) {
        throw new Error("Invite token has expired");
    }
    console.log(invite);
    
    const project = await projectRepository.findById(invite.projectId);
    if(!project) throw new Error("Project Not Found");
    let isMemeber = false;
    if(userId){
        const membership = await projectMemberRepository.findMember(userId , project.id);
        if(!project) throw new Error("Project Not Found");
        isMemeber = !!membership;
    }

    return {
        inviteId : invite.id,
        token : invite.token ,
        project : project,
        isMemeber,
        expiresAt : invite.expiresAt
    };
}

export async function reqToJoin(token , userId , message=null) {
    
    const invite = await projectInviteRepository.findByToken(token);
    if (!invite || !invite.isActive) throw new Error('Invalid invite');
    if (invite.expiresAt && invite.expiresAt < new Date()) throw new Error('Invite expired');
    
    const existingMembership = await projectMemberRepository.findMember(userId , invite.projectId);
    if(existingMembership) throw new Error("Already a member");
    
    // directly add memeber without approval temporaryly
    const newMemeber = await projectMemberRepository.create({
        projectId : invite.projectId,
        userId : userId,
        joinedAt : new Date(),
    })

    return newMemeber;
}