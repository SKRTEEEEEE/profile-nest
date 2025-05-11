import { Model } from 'mongoose';
import { MongooseBaseImpl } from './base';
import { MongooseBase, MongooseDocument } from '../types';
import { DatabaseActionError, InputParseError } from 'src/domain/errors/domain.error';

export type MongoosePopulateProps<TBase> = Array<TBase>;
export type MongoosePopulateResponse<TBase> = Promise<(TBase & MongooseBase)[]>;

export type MongoosePopulateI<TBase> = {
  populate(
    docs:MongoosePopulateProps<TBase>
  )
    : MongoosePopulateResponse<TBase>
}

export class MongoosePopulateImpl<
  TBase,
  TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions> implements MongoosePopulateI<TBase> {
  constructor(protected readonly model: Model<any>, parseOpt?: TOptions) {
    super(model, parseOpt);
  }

  async populate(docs: MongoosePopulateProps<TBase>): MongoosePopulateResponse<TBase> {
    if (docs.length === 0) throw new InputParseError("documents",'No documents to populate');
    
    try {
      const res = await this.model.insertMany(docs);
      return res.map((doc) => this.documentToPrimary(doc as TBase & MongooseDocument));
    } catch (error) {
      console.error('Error al poblar documentos:', error);
      throw new DatabaseActionError("populate",'Error in the populate action');
    }
  }
}
