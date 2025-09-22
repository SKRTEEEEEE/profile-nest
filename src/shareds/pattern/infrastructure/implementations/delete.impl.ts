import { QueryOptions, RootFilterQuery } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseBaseImpl } from "./base";
import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";
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
      if(!result)throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseDeleteByIdImpl, 'findByIdAndDelete', undefined, { entity: 'user', optionalMessage: 'User id not found' })
      return result;
    } catch (error) {
      throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseDeleteByIdImpl, 'deleteById', undefined, { optionalMessage: 'Failed to delete the document' });
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
      throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseDeleteImpl, 'delete', undefined, { optionalMessage: 'Failed to delete the document' });
    }
  }
}
