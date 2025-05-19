import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { MongooseCRUImpl } from "src/shareds/pattern/infrastructure/implementations/cru.impl";
import { MongooseDeleteByIdImpl } from "src/shareds/pattern/infrastructure/implementations/delete.impl";
import { MongooseReadOneImpl, MongooseReadOneProps, MongooseReadOneRes } from "src/shareds/pattern/infrastructure/implementations/read-one.impl";
import { MongooseReadImpl } from "src/shareds/pattern/infrastructure/implementations/read.impl";
import { MongooseUpdateImpl } from "src/shareds/pattern/infrastructure/implementations/update.impl";
import { MongooseCRRUUDidPattern } from "src/shareds/pattern/infrastructure/patterns/crruud-id.pattern";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { MongooseCRRUUDid } from "src/shareds/pattern/infrastructure/types/patterns";


@Injectable()
export class MongooseUserRepo
extends MongooseCRRUUDidPattern<UserBase>
implements MongooseCRRUUDid<UserBase>
{
    private mongooseReadOne: MongooseReadOneImpl<UserBase>
    constructor(
        @InjectModel("User") private readonly userModel: 
        Model<UserBase & MongooseBase & Document>
    ){
        super(
            userModel,
            new MongooseCRUImpl(userModel),
            new MongooseReadImpl(userModel),
            new MongooseUpdateImpl(userModel),
            new MongooseDeleteByIdImpl(userModel), 
        )
        this.mongooseReadOne = new MongooseReadOneImpl(userModel) 
    }
    async readOne(props: MongooseReadOneProps<UserBase>): MongooseReadOneRes<UserBase> {
            return await this.mongooseReadOne.readOne(props)
        }
}
