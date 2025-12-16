import { Model } from 'mongoose';
import { MongooseBaseImpl } from './base';
import { MongooseDocument } from '../types/mongoose';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';
import { DBBase } from 'src/dynamic.types';

//ToDo
// type OptionalMessage<TBase> = {
//   data: (TBase & DBBase)[];
//   message: string;
// }; //Si queremos hacer esto hemos de mirar como modificar el res.flow interno i aplicar ahi el message que queramos

export type MongoosePopulateProps<TBase> = Array<TBase>;
export type MongoosePopulateResponse<TBase> = Promise<
  (TBase & DBBase)[]
>;

export type MongoosePopulateI<TBase> = {
  populate(docs: MongoosePopulateProps<TBase>): MongoosePopulateResponse<TBase>;
};

export class MongoosePopulateImpl<TBase> extends MongooseBaseImpl<TBase> {
  constructor(
    protected readonly model: Model<TBase>,
    protected parseOpt?:Partial<Record<keyof TBase & DBBase, (value: unknown) => unknown>>
  ) {
    super(model, parseOpt);
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
        ?  res.map((doc) =>
              this.documentToPrimary(doc as TBase & MongooseDocument),
            )
          
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
