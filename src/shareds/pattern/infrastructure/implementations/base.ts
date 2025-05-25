import { Model } from "mongoose";
import { MongooseBase, MongooseDocument } from "../types";
import { DatabaseFindError } from "src/domain/flows/domain.error";


export abstract class MongooseBaseImpl<
  TBase,
  TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
>  {
  protected parseOpt?: TOptions;
  constructor(protected Model: Model<any, {}, {}, {}, any, any>, parseOpt?: TOptions) {
    this.parseOpt = parseOpt;
  }
  private flattenMap(value: any): any {
    if (value instanceof Map) {
      return Object.fromEntries(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.flattenMap(item));
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, this.flattenMap(val)])
      );
    }
    return value;
  }

// Uso en documentToPrimary
 protected documentToPrimary(document: TBase & MongooseDocument): TBase & MongooseBase {
    const { _id, createdAt, updatedAt, ...rest } = document.toObject();

    let result: Partial<TBase & MongooseBase> = {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      ...rest,
    };
    // // Transformar automáticamente Maps a objetos planos
    // Object.entries(result).forEach(([key, value]) => {
    //   if (value instanceof Map) {
    //     (result as any)[key] = Object.fromEntries(value);
    //   }
    // });
    result = this.flattenMap(result);


    // // Aplicar las transformaciones especificadas en las opciones
    if (this.parseOpt) {
      Object.entries(this.parseOpt).forEach(([key, transformFn]) => {
        if (key in result && typeof transformFn === "function") {
          result[key as keyof TBase & MongooseBase] = transformFn(result[key as keyof TBase & MongooseBase]);
        }
      });
    }

    return result as TBase & MongooseBase;
  }

  protected resArrCheck(docs: TBase & MongooseBase[] | any[] | undefined | null): void {
    if(!docs) throw new DatabaseFindError({optionalMessage:"Failed to find the documents"});
    if(Array.isArray(docs) && docs.length === 0) console.warn(`La consulta fue exitosa pero no hay documentos que coincidan ${docs}`);
  }
}