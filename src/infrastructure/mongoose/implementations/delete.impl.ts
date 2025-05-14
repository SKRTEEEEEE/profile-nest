import { QueryOptions, RootFilterQuery } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseBaseImpl } from "./base";
import { DatabaseActionError, DatabaseFindError } from "src/domain/errors/domain.error";
export type MongooseDeleteByIdRes<TB> =Promise<TB & MongooseBase>
export type MongooseDeleteByIdI<TBase> = {
  deleteById(
    id: MongooseBase["id"]
  )
    :MongooseDeleteByIdRes<TBase>
}
export class MongooseDeleteByIdImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseDeleteByIdI<TBase>{
  async deleteById(id: MongooseBase["id"]): MongooseDeleteByIdRes<TBase> {
    try {
      const result: TBase & MongooseBase | null = await this.Model.findByIdAndDelete(id);
      if(!result)throw new DatabaseFindError({entitie: 'user',optionalMessage:"User id not found"})
      return result;
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      throw new DatabaseActionError("deleteById",{optionalMessage:"Failed to delete the document"});
    }
  }
}
export type MongooseDeleteRes<TB> = Promise<(TB & MongooseBase)[]>

export type MongooseDeleteProps<TBase> = {
  filter?: RootFilterQuery<TBase> | null | undefined, 
  options?: QueryOptions<TBase> | null | undefined
}

export type MongooseDeleteI<TBase> = {
  delete(
    props: MongooseDeleteProps<TBase>
  ): MongooseDeleteRes<TBase>
}

export class MongooseDeleteImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseDeleteI<TBase>{
  async delete({filter, options}: MongooseDeleteProps<TBase>) {
    try {
      return await this.Model.findOneAndDelete(filter, options)
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      throw new DatabaseActionError("delete",{optionalMessage:"Failed to delete the document"});
    }
  }
}
