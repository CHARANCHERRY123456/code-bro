import { NODE_ERRORS } from '../constants/node.constants.js';
import nodeRepository from '../repositories/node.repository.js';
import projectMemberRepository from '../repositories/project.member.repository.js';

async function checkMembership(userId , projectId) {
    const membership = await projectMemberRepository.findMember(userId , projectId);
    if(!membership)
        throw new Error(NODE_ERRORS.UNAUTHORIZED)
}

export async function createFolder(userId, projectId, name , parentFolderId=null) {
    await checkMembership(userId , projectId);
    if(parentFolderId) {
        const parentFolder = await nodeRepository.findById(parentFolderId);
        if(!parentFolder || parentFolder.projectId !== projectId)
            throw new Error(NODE_ERRORS.INVALID_PARENT);
    }

    const folder = await nodeRepository.create({
        name,
        parentFolderId,
        projectId,
    });

    return folder;
}

export async function listFolders(userId , projectId , parentFolderId=null) {
    await checkMembership(userId , projectId);
    const folders = await nodeRepository.listByParent(projectId , parentFolderId);
    return folders;
}
