import { QueryOptions, RootFilterQuery } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseBaseImpl } from "./base";
import { DatabaseActionError, DatabaseFindError } from "src/domain/flows/domain.error";
export type MongooseDeleteByIdI<TBase> = {
  deleteById(
    id: MongooseBase["id"]
  )
    :DeleteByIdRes<TBase, MongooseBase>
}
export class MongooseDeleteByIdImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseDeleteByIdI<TBase>{
  async deleteById(id: MongooseBase["id"]): DeleteByIdRes<TBase, MongooseBase> {
    try {
      const result: TBase & MongooseBase | null = await this.Model.findByIdAndDelete(id);
      if(!result)throw new DatabaseActionError("findByIdAndDelete",MongooseDeleteByIdImpl, {entity: 'user',optionalMessage:"User id not found"})
      return result;
    } catch (error) {
      throw new DatabaseActionError("deleteById",MongooseDeleteByIdImpl,{optionalMessage:"Failed to delete the document"});
    }
  }
}

export type MongooseDeleteProps<TBase> = {
  filter?: RootFilterQuery<TBase> | null | undefined, 
  options?: QueryOptions<TBase> | null | undefined
}

export type MongooseDeleteI<TBase> = {
  delete(
    props: MongooseDeleteProps<TBase>
  ): DeleteRes<TBase, MongooseBase>
}

export class MongooseDeleteImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseDeleteI<TBase>{
  async delete({filter, options}: MongooseDeleteProps<TBase>) {
    try {
      return await this.Model.findOneAndDelete(filter, options)
    } catch (error) {
      throw new DatabaseActionError("delete",MongooseDeleteImpl,{optionalMessage:"Failed to delete the document"});
    }
  }
}
