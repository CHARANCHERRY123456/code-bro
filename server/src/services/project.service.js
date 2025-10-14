import projectRepository from "../repositories/project.repository.js";
import projectMemberRepository from "../repositories/project.member.repository.js";
import { PROJECT_ERROR, PROJECT_ROLES } from "../constants/project.constants.js";

async function createProject(userId , data) {
    const project = await projectRepository.create({
        ...data , ownerId : userId
    })
    // add creator as a project memeber
    await projectMemberRepository.create({
        userId,
        projectId : project.id,
        projectRole : PROJECT_ROLES.OWNER
    });

    return project;
}

async function listUserProjects(userId) {
    //return only project metadata
    const memberships = await projectMemberRepository.model.findMany({
        where:{userId},
        include:{project:true},
    })
    return memberships.map(m=>({
        id:m.project.id,
        name:m.project.name,
        role:m.projectRole,
    }))
}

async function getProjectDetails(projectId) {
    const project= await projectRepository.findByIdWithMembers(projectId);
    if(!project){
        throw new Error(PROJECT_ERROR.NOT_FOUND)
    }
    return {
        id:project.id,
        name:project.name,
        description:project.description,
        ownerId:project.ownerId,
        members:project.memberships.map(m=>({
            userId:m.userId,
            name:m.user.name,
            projectRole:m.projectRole,
        }))
    }
}

async function updateProject(projectId , data) {
    console.log(projectId , data , "is getting in the update project");

    return await projectRepository.update({id :projectId }, data);
}

async function deleteProject(projectId){
    return await projectRepository.delete({id :projectId});
}

async function checkIfOwner(userId , projectId) {
    
    const project = await projectRepository.findById(projectId);
    console.log(userId , projectId , "got int he check if owner service function");
    if(!project) throw new Error(PROJECT_ERROR.NOT_FOUND);
    if(project.ownerId !== userId)
        throw new Error(PROJECT_ERROR.AUTH_ERROR)
}

async function addMember(projectId , userId , projectRole) {
    const existing = await projectMemberRepository.findMember(userId , projectId);
    if(existing) throw new Error(PROJECT_ERROR.EXISTING_USER)
    return await projectMemberRepository.create({projectId , userId ,projectRole }) 
}


export default {
    createProject,
    listUserProjects,
    getProjectDetails,
    updateProject,
    checkIfOwner,
    addMember,
    deleteProject
}