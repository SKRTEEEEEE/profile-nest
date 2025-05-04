import { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";
import { MongooseBase } from ".";
export type MongooseUpdateByIdProps<TBase> = {
  id: string,
  updateData: UpdateQuery<TBase> | undefined,
  options?: QueryOptions<TBase> | null | undefined 
}
export type MongooseCRUI<
  TBase,
> = {
  create(
    data: Omit<TBase, 'id'>
  )
    : Promise<TBase & MongooseBase>
  readById(
    id: string
  )
    : Promise<TBase & MongooseBase | null>
  updateById(
    props: MongooseUpdateByIdProps<TBase>
  )
    : Promise<TBase & MongooseBase | null>
}
export type MongooseDeleteProps<TBase> = {
  filter?: RootFilterQuery<TBase> | null | undefined, 
  options?: QueryOptions<TBase> | null | undefined
}
export type MongooseDeleteI<TBase> = {
  delete(
    props: MongooseDeleteProps
  ): Promise<Query<any, any, {}, any, "findOneAndDelete", {}>>
}
export type MongooseDeleteByIdI = {
  deleteById(
    id: string
  )
    : Promise<boolean>
}
export type MongooseReadProps<TBase> = {
  filter?: FilterQuery<TBase & MongooseBase> | undefined,
  projection?: ProjectionType<TBase> | null | undefined,
  options?: QueryOptions<TBase> | null | undefined
}
export type MongooseReadResponse<TBase> = Promise<(TBase & MongooseBase)[]>
export type MongooseReadI<TBase> = {
  read(
    {filter, projection, options}:MongooseReadProps
  )
    : Query<(TBase & MongooseBase)[] | null>
}
export type MongooseUpdateProps<TBase> = {
  filter?: FilterQuery<TBase & MongooseBase> | undefined, 
  update?: UpdateQuery<TBase> | undefined, 
  options?: QueryOptions<TBase> | null | undefined
}

export type MongooseUpdateI<TBase> = {
  update(
    filter?: FilterQuery<TBase & MongooseBase> | undefined,
    update?: UpdateQuery<TBase> | undefined,
    options?: QueryOptions<TBase> | null | undefined
  )
    : Query<(TBase & MongooseBase)[], any, {}, any, "find", {}>
}
export type MongoosePopulateI<TBase> = {
  populate(
    docs: Array<TBase>
  )
    : Promise<(TBase & MongooseBase)[]>
}