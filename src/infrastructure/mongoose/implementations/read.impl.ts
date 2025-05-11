
import { MongooseBaseImpl } from './base';
import { MongooseBase } from '../types';
import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
 
export type MongooseReadProps<TBase> = {
  filter?: FilterQuery<TBase & MongooseBase> | undefined,
  projection?: ProjectionType<TBase> | null | undefined,
  options?: QueryOptions<TBase> | null | undefined
}
export type MongooseReadResponse<TBase> = Promise<(TBase & MongooseBase)[]>
export type MongooseReadI<TBase> = {
  read(
    {filter, projection, options}:MongooseReadProps<TBase>
  )
    : MongooseReadResponse<TBase>
}


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
        
        const docs = await this.Model.find(filter || {}, projection, options) // Usa un objeto vacío si filter es undefined
        return docs.map(user=>this.documentToPrimary(user))
      } catch (error) {
        console.error("Error al leer documentos:", error);
        throw new Error("Error en la operación de lectura");
      }
    }
}
