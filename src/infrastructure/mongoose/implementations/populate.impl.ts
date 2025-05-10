import { Model } from 'mongoose';
import { MongooseBaseImpl } from './base';
import { MongooseBase, MongooseDocument } from '../types';
import { MongoosePopulateI, MongoosePopulateProps, MongoosePopulateResponse } from '../types/implementations';
import { DatabaseOperationError, InputParseError } from 'src/domain/errors/main';



export class MongoosePopulateImpl<
  TBase,
  TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions> implements MongoosePopulateI<TBase> {
  constructor(protected readonly model: Model<any>, parseOpt?: TOptions) {
    super(model, parseOpt);
  }

  async populate(docs: MongoosePopulateProps<TBase>): MongoosePopulateResponse<TBase> {
    if (docs.length === 0) throw new InputParseError('No documents to populate');
    await this.connect();
    try {
      const res = await this.model.insertMany(docs);
      return res.map((doc) => this.documentToPrimary(doc as TBase & MongooseDocument));
    } catch (error) {
      console.error('Error al poblar documentos:', error);
      throw new DatabaseOperationError('Error en la operación de poblado');
    }
  }
}
