import { Injectable } from "@nestjs/common";
import { LengBase } from "src/domain/entities/tech";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MongooseCRRUUDPattern } from "src/shareds/pattern/infrastructure/patterns/crruud.pattern";
import { MongooseCRRUUD } from "src/shareds/pattern/infrastructure/types/patterns";
import { MongooseReadOneI, MongooseReadOneImpl, MongooseReadOneProps, MongooseReadOneRes } from "src/shareds/pattern/infrastructure/implementations/read-one.impl";
import { MongooseCRUImpl } from "src/shareds/pattern/infrastructure/implementations/cru.impl";
import { MongooseReadImpl } from "src/shareds/pattern/infrastructure/implementations/read.impl";
import { MongooseUpdateImpl } from "src/shareds/pattern/infrastructure/implementations/update.impl";
import { MongooseDeleteImpl } from "src/shareds/pattern/infrastructure/implementations/delete.impl";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";

@Injectable()
export class MongooseTechRepo
extends MongooseCRRUUDPattern<LengBase>
implements MongooseCRRUUD<LengBase>,
MongooseReadOneI<LengBase>
{
    private mongooseReadOne: MongooseReadOneImpl<LengBase>
    constructor(
        @InjectModel("Lenguaje") private readonly lengModel: Model<LengBase & MongooseBase & Document>)
    {
        super(
            lengModel,
            new MongooseCRUImpl(lengModel),
            new MongooseReadImpl(lengModel),
            new MongooseUpdateImpl(lengModel),
            new MongooseDeleteImpl(lengModel),
        )
        // extra - externo del Pattern
        this.mongooseReadOne = new MongooseReadOneImpl(lengModel) 
    }
    async readOne(props: MongooseReadOneProps<LengBase>): MongooseReadOneRes<LengBase> {
        return await this.mongooseReadOne.readOne(props)
    }
}