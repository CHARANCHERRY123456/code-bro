import { randomUUID } from "crypto";
import projectRepository from "../repositories/project.repository.js";
import ProjecInviteRepository from "../repositories/projectinvite.repository.js";
import ProjectJoinRequestRepository from "../repositories/project.invite.repository.js";

import userRepository from "../repositories/user.repository.js";
import sendMail from "../utils/mailer.js";
import projectInviteRepository from "../repositories/projectinvite.repository.js";

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