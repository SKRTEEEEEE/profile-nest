import { QueryOptions, UpdateQuery } from 'mongoose';
import { MongooseDocument } from '../types/mongoose';
import { MongooseBaseImpl } from './base';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { DBBase } from '@/dynamic.types';

export type MongooseUpdateByIdProps<TBase> = {
  id: string;
  updateData: UpdateQuery<TBase> ;
  options?: QueryOptions<TBase> | null | undefined;
};
export type MongooseCRUI<TBase> = {
  create(data: Omit<TBase, 'id'>): Promise<TBase & DBBase>;
  readById(id: string): Promise<TBase & DBBase>;
  updateById(
    props: MongooseUpdateByIdProps<TBase>,
  ): Promise<TBase & DBBase>;
};
export class MongooseCRUImpl<TBase>
  extends MongooseBaseImpl<TBase>
  implements MongooseCRUI<TBase>
{
  async create(data: Omit<TBase, 'id'>): Promise<TBase & DBBase> {
    try {
      const newDocument: TBase & MongooseDocument = new this.Model(data);
      const savedDocument = await newDocument.save();
      if (!savedDocument) {
        throw createDomainError(
          ErrorCodes.DATABASE_ACTION,
          MongooseCRUImpl,
          'Document.save',
          undefined,
          { optionalMessage: 'Failed to save the document' },
        );
      }
      return this.documentToPrimary(savedDocument);
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseCRUImpl,
        'create',
        undefined,
        { optionalMessage: 'Failed to create the document' },
      );
    }
  }

  async readById(id: string): Promise<TBase & DBBase> {
    try {
      const document = await this.Model.findById(id);
      if (!document) {
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          MongooseCRUImpl,
          'Model.findById',
          undefined,
          { optionalMessage: 'Failed to find the document' },
        );
      }
      return this.documentToPrimary(document);
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseCRUImpl,
        'readById',
        undefined,
        { optionalMessage: 'Failed to read the document' },
      );
    }
  }

  async updateById({
    id,
    updateData,
    options,
  }: MongooseUpdateByIdProps<TBase>): Promise<TBase & DBBase> {
    try {
      const updatedDocument = await this.Model.findByIdAndUpdate(
        id,
        updateData,
        options
          ? options
          : {
              new: true,
            },
      );
      if (!updatedDocument)
        throw createDomainError(
          ErrorCodes.DATABASE_ACTION,
          MongooseCRUImpl,
          'Model.findByIdAndUpdate',
          undefined,
          { optionalMessage: 'Failed to update the document' },
        );
      return this.documentToPrimary(updatedDocument);
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseCRUImpl,
        'updateById',
        undefined,
        { optionalMessage: 'Failed to update the document' },
      );
    }
  }
}
