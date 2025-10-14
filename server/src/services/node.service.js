import { NODE_ERRORS, NODE_TYPES } from '../constants/node.constants.js';
import nodeRepository from '../repositories/node.repository.js';
import projectMemberRepository from '../repositories/project.member.repository.js';

async function checkMembership(userId , projectId) {
    const membership = await projectMemberRepository.findMember(userId , projectId);
    if(!membership)
        throw new Error(NODE_ERRORS.UNAUTHORIZED)
}

export async function createNode(userId, projectId, name,type , parentId=null , content=null) {
    await checkMembership(userId , projectId);
    if(![NODE_TYPES.FILE , NODE_TYPES.FOLDER].includes(type)) {
        throw new Error(NODE_ERRORS.INVALID_NODE_TYPE);
    }
    if(parentId) {
        const parentFolder = await nodeRepository.findById(parentId);
        if(!parentFolder || parentFolder.projectId !== projectId)
            throw new Error(NODE_ERRORS.INVALID_PARENT);
    }

    const node = await nodeRepository.create({
        name,
        type,
        content:type===NODE_TYPES.FILE ? content : null,
        parentId,
        projectId,
        createdById: userId
    });

    return node;
}

export async function listNodes(userId , projectId , parentId=null) {
    await checkMembership(userId , projectId);
    const nodes = await nodeRepository.listByParent(projectId , parentId);
    return nodes;
}
