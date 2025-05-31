import { Model } from 'mongoose';
import { MongooseBaseImpl } from './base';
import { MongooseBase, MongooseDocument } from '../types';
import { DatabaseActionError, InputParseError } from 'src/domain/flows/domain.error';

//ToDo
type OptionalMessage<TBase> = {
  data: (TBase & MongooseBase)[],
  message: string 
}

export type MongoosePopulateProps<TBase> = Array<TBase>;
export type MongoosePopulateResponse<TBase> = Promise<(TBase & MongooseBase)[] | OptionalMessage<TBase>>;

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
    if (docs.length === 0) throw new InputParseError(MongoosePopulateImpl,'No documents to populate');
    
    try {
      const res = await this.model.insertMany(docs);
      const { customMessage } = this.resArrCheck(res);
      return customMessage ? 
      {
        message: customMessage,
        data: res.map((doc) => this.documentToPrimary(doc as TBase & MongooseDocument))
      } : res.map((doc) => this.documentToPrimary(doc as TBase & MongooseDocument));
    } catch (error) {
      throw new DatabaseActionError("populate",MongoosePopulateImpl,{optionalMessage:'Error in the populate action'});
    }
  }
}
