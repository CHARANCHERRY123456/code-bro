import { PrismaClient } from "@prisma/client";
import CrudRepository from "./crud.repository.js";

const prisma = new PrismaClient();

class ProjectInviteRepository extends CrudRepository {
  constructor() {
    super(prisma.projectInvite);
  }

  async findByToken(token) {
    return await this.model.findUnique({
      where: { token },
    });
  }

  async listByProjectId(projectId) {
    return await this.model.findMany({
      where: { projectId , isActive : true },
    });
  }

  async disableByToken(token) {
    return await this.model.update({
        where : {token},
        data : {isActive : false}
    })
  }
}

export default new ProjectInviteRepository();