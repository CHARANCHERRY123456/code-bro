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
