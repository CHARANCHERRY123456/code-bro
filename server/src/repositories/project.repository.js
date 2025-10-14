import PrismaClient from '@prisma/client';
import CrudRepository from './crud.repository.js';

const prisma = new PrismaClient.PrismaClient();

class ProjectRepository extends CrudRepository {
    constructor() {
        super(prisma.project);
    }

    async findByOwnerId(ownerId) {
        return await this.model.findMany({
            where: { ownerId },
        });
    };

    async findByIdWithMembers(id) {
        return await this.model.findUnique({
            where: { id },
            include: { memberships : {include : {user : true}} },
        });
    }
}

export default new ProjectRepository();