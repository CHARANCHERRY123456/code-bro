import projectService from "../services/project.service.js";

async function create(req , res , next) {
    try {
        const project = await projectService.createProject(req.user.id , req.body);
        res.status(201).json({
            success : true,
            data : project
        })
    } catch (error) {
        next(error)
    }
}

async function list(req,res,next){
    try{
        const projects = await projectService.listUserProjects(req.user.id);
        res.json({success:true,data:projects});
    }catch(error){
        next(error);
    }
}

async function details(req,res,next) {
    try{
        const projectId=parseInt(req.params.projectId);
        const project = await projectService.getProjectDetails(projectId);
        res.json({
            success:true,
            data:project
        })
    }catch(error){
        next(error)
    }
}

async function update(req, res, next) {
    try {
        const projectId = parseInt(req.params.projectId);
        console.log(projectId , "is in the update project");
        const project = await projectService.updateProject(projectId, req.body);
        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

async function deleteProject(req, res, next) {
    try {
        const projectId = parseInt(req.params.projectId);
        await projectService.deleteProject(projectId);
        res.json({ success: true, message: 'Project deleted' });
    } catch (err) {
        next(err);
    }
}

async function addMember(req, res, next) {
    try {
        const projectId = parseInt(req.params.projectId);
        const { userId, projectRole } = req.body;
        const membership = await projectService.addMember(projectId, userId, projectRole);
        res.json({ success: true, data: membership });
    } catch (err) {
        next(err);
    }
}


export default {
    create,
    list,
    details,
    update,
    deleteProject,
    addMember
}