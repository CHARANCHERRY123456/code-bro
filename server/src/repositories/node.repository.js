import { PrismaClient } from '@prisma/client';
import CrudRepository from './crud.repository.js';

const prisma = new PrismaClient();

class NodeRepository extends CrudRepository {
    constructor() {
        super(prisma.node);
    }
    async listByParent(projectId,parentId=null) {
        return await this.model.findMany({
            where: { projectId },
            orderBy: { name: 'asc' }
        });
    }
}

export default new NodeRepository();