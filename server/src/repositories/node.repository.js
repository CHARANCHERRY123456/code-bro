import { PrismaClient } from '@prisma/client';
import CrudRepository from './crud.repository.js';

const prisma = new PrismaClient();

class NodeRepository extends CrudRepository {
    constructor() {
        super(prisma.node);
    }
    async listByParent(projectId,parentId=null) {
        return await this.model.findMany({
            where: { projectId, parentId },
            orderBy: { name: 'asc' }
        });
    }

    async findById(nodeId){
        return await this.model.findUnique({
            where: { id: nodeId }
        });
    }
}

export default new NodeRepository();