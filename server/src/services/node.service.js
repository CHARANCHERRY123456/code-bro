import { NODE_ERRORS, NODE_TYPES } from '../constants/node.constants.js';
import nodeRepository from '../repositories/node.repository.js';
import projectMemberRepository from '../repositories/project.member.repository.js';

async function checkMembership(userId , projectId) {
    const membership = await projectMemberRepository.findMember(userId , projectId);
    if(!membership)
        throw new Error(NODE_ERRORS.UNAUTHORIZED)
}


// for now assuming all members of project can edit nodes
async function checkEditPermissions(userId, nodeId) {
    const node = await nodeRepository.findById(nodeId);
    if(!node)
        throw new Error(NODE_ERRORS.NOT_FOUND)
    const membership = await projectMemberRepository.findMember(userId , node.projectId);
    console.log(membership , "is the memebership");
    
    if(!membership)
        throw new Error(NODE_ERRORS.UNAUTHORIZED)
    return node;
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

export async function fetchNode(userId , nodeId) {
    const node = await nodeRepository.findById(nodeId);
    if(!node)
        throw new Error(NODE_ERRORS.NOT_FOUND);
    await checkMembership(userId , node.projectId);
    if(node.type === NODE_TYPES.FOLDER) {
        const children = await nodeRepository.listByParent(node.projectId , node.id);
        node.children = children;
    }
    return node;
}

export async function updateContent(userId , nodeId , content) {
    const node = await checkEditPermissions(userId , nodeId);
    if(node.type !== NODE_TYPES.FILE)
        throw new Error(NODE_ERRORS.INVALID_NODE_TYPE);
    const updated = await nodeRepository.update({id : nodeId} , { content });
    return updated;
}

export async function renameNode(userId , nodeId , name) {
    const node = await checkEditPermissions(userId , nodeId);
    const conflictNames = await nodeRepository.findAll({ parentId: node.parentId, name });
    if(conflictNames.length > 0)
        throw new Error(NODE_ERRORS.ALREADY_EXISTS);
    const updated = await nodeRepository.update({id : nodeId} , { name });
    return updated;
}