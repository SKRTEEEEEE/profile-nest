import { Model } from 'mongoose';
import { MongooseBase, MongooseDocument } from '../types/mongoose';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';

export abstract class MongooseBaseImpl<TBase> {
  protected parseOpt?: any;
  constructor(
    protected Model: Model<any, any, any, any, any, any>,
    parseOpt?: any,
  ) {
    this.parseOpt = parseOpt;
  }
  private flattenMap(value: any): any {
    if (value instanceof Map) {
      return Object.fromEntries(value);
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.flattenMap(item));
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, this.flattenMap(val)]),
      );
    }
    return value;
  }

  // Uso en documentToPrimary
  protected documentToPrimary(
    document: TBase & MongooseDocument,
  ): TBase & MongooseBase {
    const { _id, createdAt, updatedAt, ...rest } = document.toObject();

    let result: Partial<TBase & MongooseBase> = {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      ...rest,
    };
    result = this.flattenMap(result);

    // // Aplicar las transformaciones especificadas en las opciones
    if (this.parseOpt) {
      Object.entries(this.parseOpt).forEach(([key, transformFn]) => {
        if (key in result && typeof transformFn === 'function') {
          result[key as keyof TBase & MongooseBase] = transformFn(
            result[key as keyof TBase & MongooseBase],
          );
        }
      });
    }

    return result as TBase & MongooseBase;
  }

  protected resArrCheck(
    docs: (TBase & MongooseBase[]) | any[] | undefined | null,
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
