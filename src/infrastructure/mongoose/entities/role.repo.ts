import { Injectable } from "@nestjs/common";
import { MongooseCRRUDDPattern } from "../patterns/crrudd.pattern";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { MongooseCRUImpl } from "../implementations/cru.impl";
import { MongooseReadImpl } from "../implementations/read.impl";
import { MongooseDeleteByIdImpl, MongooseDeleteImpl } from "../implementations/delete.impl";
import { MongooseCRRUDD } from "../types/patterns";
import { RoleRepository } from "src/application/interfaces/entities/role.interface";
import { MongooseBase } from "../types";
import { RoleBase } from "src/domain/entities/role";

@Injectable()
export class MongooseRoleRepo 
extends MongooseCRRUDDPattern<RoleBase> 
implements MongooseCRRUDD<RoleBase>, RoleRepository<MongooseBase>
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
