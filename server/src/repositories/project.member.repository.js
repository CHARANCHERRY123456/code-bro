import { PrismaClient } from "@prisma/client";
import CrudRepository from "./crud.repository.js";

const prisma = new PrismaClient();

class ProjectMembershipRepository extends CrudRepository {
  constructor() {
    super(prisma.projectMembership);
  }
  async findMember(userId , projectId)
  {
    return await this.model.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });
  }

  async listMember(projectId){
    return await this.model.findMany({
      where: { projectId },
      include: { user: true },
    });
  }
}

export default new ProjectMembershipRepository();