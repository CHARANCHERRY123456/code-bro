import projectService from '../services/project.service.js'

export async function OwnerCheckMiddleware(req , res , next) {
    try {
        
        await projectService.checkIfOwner(req.user.id , parseInt(req.params.projectId ))   
        console.log(req.params , req.body , "is the params and body of project");
        next();
    } catch (error) {
        res.status(401).json({
            message : error.message,
        })
    }
}