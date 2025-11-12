import { PrismaClient } from "@prisma/client";
import CrudRepository from "./crud.repository.js";

const prisma = new PrismaClient();

class ProjectInviteRepository extends CrudRepository {
  constructor() {
    super(prisma.projectInvite);
  }

  async findPendingByProject(projectid){
    return await this.model.findMany({
        where : {projectId:projectid,status:'PENDING'},
        include : {user : true},
        orderBy : {createdAt :'desc'}
    })
  }

  async findById(id){
    return await this.model.findUnique({
        where : {id},
        include : {user : true}
    })
  }

}

export default new ProjectInviteRepository();