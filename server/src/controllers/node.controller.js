import { NODE_ERRORS } from '../constants/node.constants.js';
import * as NodeServices from '../services/node.service.js';

export async function createNode(req, res, next) {
    try {
        const {projectId , name , type , parentId , content} = req.body;
        const userId = req.user.id;
        if(!projectId || !name) return res.status(400).json({message: NODE_ERRORS.PROJECT_NAME_REQUIRED});
        const node = await NodeServices.createNode(userId, projectId, name , type, parentId, content);
        return res.status(201).json({
            success : true,
            data : node
        });
    } catch (error) {
        next(error);
    }
}

export async function list(req , res , next) {
    try {
        const {projectId , parentId} = req.query;
        
        const userId = req.user.id;
        if(!projectId) return res.status(400).json({message: NODE_ERRORS.PROJECT_NAME_REQUIRED});
        const nodes = await NodeServices.listNodes(userId , parseInt(projectId) ,parentId? parseInt(parentId) : null);
        return res.status(200).json({
            success : true,
            data : nodes
        });
    } catch (error) {
        next(error);
    }
}

export async function fetchNode(req , res , next) {
    try {
        const {nodeId} = req.params;
        console.log(nodeId , "is trying to fetch");
        
        const userId = req.user.id;
        if(!nodeId) return res.status(400).json({message: NODE_ERRORS.NODE_ID_REQUIRED});
        const node = await NodeServices.fetchNode(userId , parseInt(nodeId));
        return res.status(200).json({
            success : true,
            data : node
        });
    } catch (error) {
        next(error);
    }
}

export async function updateContent(req ,res , next) {
    try {
        const {nodeId} = req.params;
        const {content} = req.body;
        const userId = req.user.id;
        if(!nodeId) {
            console.log("bro not getting node id please check once");
            
            return res.status(400).json({message: NODE_ERRORS.NODE_ID_REQUIRED});
        }
        const node = await NodeServices.updateContent(userId , parseInt(nodeId) , content);
        return res.status(200).json({
            success : true,
            data : node
        });
    } catch (error) {
        next(error);
    }
}

export async function renameNode(req ,res , next) {
    try {
        const {nodeId} = req.params;
        const {name} = req.body;
        const userId = req.user.id;
        if(!nodeId) return res.status(400).json({message: NODE_ERRORS.NODE_ID_REQUIRED});
        if(!name) return res.status(400).json({message: NODE_ERRORS.NAME_REQUIRED});
        const node = await NodeServices.renameNode(userId , parseInt(nodeId) , name);
        return res.status(200).json({
            success : true,
            data : node
        });
    } catch (error) {
        next(error);
    }
}
