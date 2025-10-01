import { Model } from 'mongoose';
import { MongooseDocument } from '../types/mongoose';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { DBBase } from '@/dynamic.types';

export abstract class MongooseBaseImpl<TBase> {
  constructor(
    protected Model: Model<TBase>,
  ) {
  }


  // Uso en documentToPrimary
  protected documentToPrimary(
    document: TBase & MongooseDocument,
  ): TBase & DBBase {
    const { _id, createdAt, updatedAt, ...rest } = document.toObject();

    const result: Partial<TBase & DBBase> = {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      ...rest,
    };

    return result as TBase & DBBase;
  }

  protected resArrCheck(
    docs: (TBase & DBBase[]) | any[] | undefined | null,
  ): { customMessage?: string } {
    if (!docs)
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseBaseImpl,
        'resArrCheck',
        undefined,
        { optionalMessage: 'Failed to find the documents' },
      );

    if (Array.isArray(docs) && docs.length === 0) {
      return {
        customMessage:
          'The query was successful but there are no matching documents.',
      };
    }
    return {};
  }
}
