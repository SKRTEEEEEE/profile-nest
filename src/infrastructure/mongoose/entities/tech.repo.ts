import { Injectable } from "@nestjs/common";
import { MongooseCRRUUDPattern } from "../patterns/crruud.pattern";
import { LengBase } from "src/domain/entities/tech";
import { MongooseCRRUUD } from "../types/patterns";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MongooseCRUImpl } from "../implementations/cru.impl";
import { MongooseReadImpl } from "../implementations/read.impl";
import { MongooseUpdateImpl } from "../implementations/update.impl";
import { MongooseDeleteImpl } from "../implementations/delete.impl";
import { MongooseBase } from "../types";
import { MongooseReadOneI, MongooseReadOneImpl, MongooseReadOneProps, MongooseReadOneRes } from "../implementations/read-one.impl";

@Injectable()
export class MongooseTechRepo
extends MongooseCRRUUDPattern<LengBase>
implements MongooseCRRUUD<LengBase>,
MongooseReadOneI<LengBase>
{
    constructor(
        @InjectModel("Lenguaje") private  readonly lengModel: Model<LengBase & MongooseBase & Document>)
    {
        super(
            lengModel,
            new MongooseCRUImpl(lengModel),
            new MongooseReadImpl(lengModel),
            new MongooseUpdateImpl(lengModel),
            new MongooseDeleteImpl(lengModel),
            new MongooseReadOneImpl(lengModel) // extra - externo del Pattern
        )
    }
    async readOne(props: MongooseReadOneProps<LengBase>): MongooseReadOneRes<LengBase> {
        return await this.readOne(props)
    }
}