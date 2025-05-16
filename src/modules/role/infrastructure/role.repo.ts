import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

// import { RoleRepository } from "src/application/interfaces/entities/role.interface";
// import { MongooseBase } from "../types";
import { RoleBase } from "src/domain/entities/role";
import { MongooseCRUImpl } from "src/shareds/pattern/infrastructure/implementations/cru.impl";
import { MongooseDeleteByIdImpl, MongooseDeleteImpl } from "src/shareds/pattern/infrastructure/implementations/delete.impl";
import { MongooseReadImpl } from "src/shareds/pattern/infrastructure/implementations/read.impl";
import { MongooseCRRUDDPattern } from "src/shareds/pattern/infrastructure/patterns/crrudd.pattern";
import { MongooseCRRUDD } from "src/shareds/pattern/infrastructure/types/patterns";


@Injectable()
export class MongooseRoleRepo 
extends MongooseCRRUDDPattern<RoleBase> 
implements MongooseCRRUDD<RoleBase>
// , RoleRepository<MongooseBase>
{
    constructor(@InjectModel("Role") private readonly roleModel:Model<RoleBase & Document>){
        super(
            roleModel,
            new MongooseCRUImpl(roleModel), 
            new MongooseReadImpl(roleModel),
            new MongooseDeleteByIdImpl(roleModel),
            new MongooseDeleteImpl(roleModel)
        )
    }
    // async testtypes() {
    //     this.read({options: {hdsaj:}})
    // }

}
