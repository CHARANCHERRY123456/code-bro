import { FOLDER_ERRORS } from '../constants/folder.constants.js';
import folderRepository from '../repositories/folder.repository.js';
import projectMemberRepository from '../repositories/project.member.repository.js';

async function checkMembership(userId , projectId) {
    const membership = await projectMemberRepository.findMember(userId , projectId);
    if(!membership)
        throw new Error(FOLDER_ERRORS.UNAUTHORIZED)
}

export async function createFolder(userId, projectId, name , parentFolderId=null) {
    await checkMembership(userId , projectId);
    if(parentFolderId) {
        const parentFolder = await folderRepository.findById(parentFolderId);
        if(!parentFolder || parentFolder.projectId !== projectId)
            throw new Error(FOLDER_ERRORS.INVALID_PARENT);
    }

    const folder = await folderRepository.create({
        name,
        parentFolderId,
        projectId,
    });

    return folder;
}

export async function listFolders(userId , projectId , parentFolderId=null) {
    await checkMembership(userId , projectId);
    const folders = await folderRepository.listByProject(projectId , parentFolderId);
    return folders;
}
