import { Model } from 'mongoose';
import { MongooseBaseImpl } from './base';
import { MongooseBase, MongooseDocument } from '../types/mongoose';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';

//ToDo
type OptionalMessage<TBase> = {
  data: (TBase & MongooseBase)[];
  message: string;
};

export type MongoosePopulateProps<TBase> = Array<TBase>;
export type MongoosePopulateResponse<TBase> = Promise<
  (TBase & MongooseBase)[] | OptionalMessage<TBase>
>;

export type MongoosePopulateI<TBase> = {
  populate(docs: MongoosePopulateProps<TBase>): MongoosePopulateResponse<TBase>;
};

export class MongoosePopulateImpl<TBase> extends MongooseBaseImpl<TBase> {
  constructor(
    protected readonly model: Model<any>  ) {
    super(model);
  }

  async populate(
    docs: MongoosePopulateProps<TBase>,
  ): MongoosePopulateResponse<TBase> {
    if (docs.length === 0)
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongoosePopulateImpl,
        'populate',
        {
          es: 'No hay documentos nuevos para actualizar la lista',
          en: 'There are no new documents to update the list',
          ca: 'No hi ha documents nous per actualitzar la llista',
          de: 'Es gibt keine neuen Dokumente, um die Liste zu aktualisieren',
        },
        { shortDesc: 'No documents to populate' },
      );

    try {
      const res = await this.model.insertMany(docs);
      const { customMessage } = this.resArrCheck(res);
      return customMessage
        ? {
            message: customMessage,
            data: res.map((doc) =>
              this.documentToPrimary(doc as TBase & MongooseDocument),
            ),
          }
        : res.map((doc) =>
            this.documentToPrimary(doc as TBase & MongooseDocument),
          );
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongoosePopulateImpl,
        'populate',
        undefined,
        { optionalMessage: 'Error in the populate action' },
      );
    }
  }
}
