import { PrismaClient } from '@prisma/client';
import CrudRepository from './crud.repository.js';

const prisma = new PrismaClient();

class FolderRepository extends CrudRepository {
    constructor() {
        super(prisma.folder);
    }
    async listByProject(projectId,parentFolderId=null) {
        return await this.model.findMany({
            where: { projectId, parentFolderId },
            orderBy: { name: 'asc' }
        });
    }

    async findById(folderId){
        return await this.model.findUnique({
            where: { id: folderId }
        });
    }
}

export default new FolderRepository();