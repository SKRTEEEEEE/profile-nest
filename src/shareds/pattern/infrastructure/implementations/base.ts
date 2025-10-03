import { Model } from 'mongoose';
import { MongooseDocument } from '../types/mongoose';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { DBBase } from 'src/dynamic.types';

export abstract class MongooseBaseImpl<TBase> {
  constructor(
    protected Model: Model<TBase>,
     protected parseOpt?:Partial<Record<keyof TBase & DBBase, (value: unknown) => unknown>>
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

    if (this.parseOpt) {
      Object.entries(this.parseOpt).forEach(([key, transformFn]) => {
        if (key in result && typeof transformFn === "function") {
          result[key as keyof TBase & DBBase] = transformFn(result[key as keyof TBase & DBBase]);
        }
      });
    }
    return result as TBase & DBBase;
  }

  protected resArrCheck(
    docs: (TBase & DBBase)[] | any[] | undefined | null,
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
