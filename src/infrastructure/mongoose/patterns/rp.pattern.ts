import { Model } from "mongoose";

import { MongooseBase } from "../types";
import { MongooseRp } from "../types/patterns";
import { MongooseBaseImpl } from "../implementations/base";
import { MongooseReadImpl, MongooseReadProps, MongooseReadResponse } from "../implementations/read.impl";
import { MongoosePopulateImpl, MongoosePopulateProps, MongoosePopulateResponse } from "../implementations/populate.impl";

/* 
- Rp -> Read, Populate
primario, proviene de las implementaciones
Aquí solo se implementan patrones de repositorios
- para utilizar las TOptions, se debe implementar en los repositorios de implementación que contiene
*/
export abstract class MongooseRpPattern<
    TBase,
    TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions> 
implements MongooseRp<TBase>
    {
    // private readRepo: MongooseReadImpl<TBase, TOptions>;
    // private populateRepo: MongoosePopulateImpl<TBase, TOptions>;
   
    constructor(
        Model: Model<any, {}, {}, {}, any, any>,
        private readonly readRepo: MongooseReadImpl<TBase, TOptions>,
        private readonly populateRepo: MongoosePopulateImpl<TBase, TOptions>, 
        parseOpt?: TOptions) {
        super(Model, parseOpt);
        // this.readRepo = new MongooseReadImpl(this.Model, parseOpt);
        // this.populateRepo = new MongoosePopulateImpl(this.Model, parseOpt);
    }
    async read(
        props: MongooseReadProps<TBase>
    ): MongooseReadResponse<TBase> {
        return await this.readRepo.read(props);
    }
    async populate(docs: MongoosePopulateProps<TBase>): MongoosePopulateResponse<TBase> {
        return await this.populateRepo.populate(docs);
    }

  
}