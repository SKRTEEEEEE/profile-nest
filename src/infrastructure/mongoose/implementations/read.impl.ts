
import { MongooseBaseImpl } from './base';
import { MongooseBase } from '../types';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { DatabaseActionError } from 'src/domain/errors/domain.error';
 
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
    constructor(Model: Model<TBase & MongooseBase>, parseOpt?: TOptions) {
        super(Model, parseOpt);
    }
    // -> Read All
    async read(
      {filter, projection, options}: MongooseReadProps<TBase> 
    ): MongooseReadResponse<TBase> {
      try {
        const docs = await this.Model.find(filter || {}, projection, options) // Usa un objeto vacío si filter es undefined
        this.resArrCheck(docs)
        return docs.map(doc=>this.documentToPrimary(doc))
      } catch (error) {
        console.error("Error al leer documentos:", error);
        throw new DatabaseActionError("find",{optionalMessage:"Error en la operación de lectura"});
      }
    }
}
