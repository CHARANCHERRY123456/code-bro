class CrudRepository {
    constructor(model) {
        // model is prisma client delegate e.g. prisma.user
        if (!model) throw new Error('CrudRepository: model is required');
        this.model = model;
    }

    async create(data) {
        return this.model.create({data});
    }

    async findOne(where , include={}){
        return await this.model.findUnique({
            where , include
        })
    }

    async findAll(where={} , include={} , orderBy={}){
        return await this.model.findMany({
            where, include, orderBy
        });
    }

    async findById(id , include={}) {
        return await this.model.findUnique({
            where: { id },
         });
    }
    
    async update(where , data){
        return await this.model.update({
            where , data
        })
    }

    async delete(where){
        return await this.model.delete({where});
    }

    async count(where={}){
        return await this.model.count({where});
    }
}

export default CrudRepository;