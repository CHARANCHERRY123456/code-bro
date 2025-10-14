import { FOLDER_ERRORS } from '../constants/folder.constants.js';
import * as FolderServices from '../services/folder.service.js';

export async function createFolder(req, res, next) {
    try {
        const {projectId , name , parentFolderId} = req.body;
        const userId = req.user.id;
        if(!projectId || !name) return res.status(400).json({message: FOLDER_ERRORS.PROJECT_NAME_REQUIRED});
        const folder = await FolderServices.createFolder(userId, projectId, name, parentFolderId);
        return res.status(201).json(folder);
    } catch (error) {
        next(error);
    }
}

export async function list(req , res , next) {
    try {
        const {projectId , parentFolderId} = req.query;
        const userId = req.user.id;
        if(!projectId) return res.status(400).json({message: FOLDER_ERRORS.PROJECT_ID_REQUIRED});
        const folders = await FolderServices.listFolders(userId , parseInt(projectId) ,parentFolderId? parseInt(parentFolderId) : null);
        return res.status(200).json({
            success : true,
            data : folders
        });
    } catch (error) {
        next(error);
    }
}