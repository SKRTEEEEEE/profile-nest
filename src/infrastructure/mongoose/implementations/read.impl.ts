
import { MongooseBaseImpl } from './base';
import { MongooseBase } from '../types';
import { Model } from 'mongoose';
import { MongooseReadI, MongooseReadProps, MongooseReadResponse } from '../types/implementations';

export class MongooseReadImpl <
TBase,
TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions> implements MongooseReadI<TBase>{
    constructor(Model: Model<any, {}, {}, {}, any, any>, parseOpt?: TOptions) {
        super(Model, parseOpt);
    }
    // -> Read All
    async read(
      {filter, projection, options}: MongooseReadProps<TBase> 
    ): MongooseReadResponse<TBase> {
      try {
        await this.connect();
        const docs = await this.Model.find(filter || {}, projection, options) // Usa un objeto vacío si filter es undefined
        return docs.map(user=>this.documentToPrimary(user))
      } catch (error) {
        console.error("Error al leer documentos:", error);
        throw new Error("Error en la operación de lectura");
      }
    }
}
