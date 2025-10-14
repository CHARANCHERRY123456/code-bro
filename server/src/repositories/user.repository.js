import { PrismaClient } from "@prisma/client";
import CrudRepository from "./crud.repository.js";

const prisma = new PrismaClient();

class UserRepository extends CrudRepository{
    constructor(){
        super(prisma.user)
    }

    async findByEmail(email){
        return await this.model.findUnique({
            where : {email}
        })
    };
}

export default new UserRepository();

