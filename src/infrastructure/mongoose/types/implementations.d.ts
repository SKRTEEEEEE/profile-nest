import { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";
import { MongooseBase } from ".";
 type MongooseUpdateByIdProps<TBase> = {
  id: string,
  updateData: UpdateQuery<TBase> | undefined,
  options?: QueryOptions<TBase> | null | undefined 
}
 type MongooseCRUI<
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
 type MongooseDeleteProps<TBase> = {
  filter?: RootFilterQuery<TBase> | null | undefined, 
  options?: QueryOptions<TBase> | null | undefined
}
 type MongooseDeleteI<TBase> = {
  delete(
    props: MongooseDeleteProps
  ): Promise<Query<any, any, {}, any, "findOneAndDelete", {}>>
}
 type MongooseDeleteByIdI = {
  deleteById(
    id: string
  )
    : Promise<boolean>
}
 type MongooseReadProps<TBase> = {
  filter?: FilterQuery<TBase & MongooseBase> | undefined,
  projection?: ProjectionType<TBase> | null | undefined,
  options?: QueryOptions<TBase> | null | undefined
}
 type MongooseReadResponse<TBase> = Promise<(TBase & MongooseBase)[]>
 type MongooseReadI<TBase> = {
  read(
    {filter, projection, options}:MongooseReadProps
  )
    : Query<(TBase & MongooseBase)[] | null>
}
 type MongooseUpdateProps<TBase> = {
  filter?: FilterQuery<TBase & MongooseBase> | undefined, 
  update?: UpdateQuery<TBase & MongooseBase> | undefined, 
  options?: QueryOptions<TBase & MongooseBase> | null | undefined
}

type MongooseUpdateMeta<TBase> = UpdateMeta<
  TBase,
  MongooseBase,
  FilterQuery<TBase & MongooseBase>,
  UpdateQuery<TBase & MongooseBase>,
  QueryOptions<TBase & MongooseBase>
  >

type MongooseUpdateI<TBase> = UpdateRepository<TBase, MongooseUpdateMeta<TBase>>  
  // update(
  //   filter?: FilterQuery<TBase & MongooseBase> | undefined,
  //   update?: UpdateQuery<TBase> | undefined,
  //   options?: QueryOptions<TBase> | null | undefined,
  // )
  //   : Query<(TBase & MongooseBase)[], any, {}, any, "find", {}>

 type MongoosePopulateI<TBase> = {
  populate(
    docs:MongoosePopulateProps
  )
    : MongoosePopulateResponse
}
 type MongoosePopulateProps<TBase> = Array<TBase>;
 type MongoosePopulateResponse<TBase> = Promise<(TBase & MongooseBase)[]>;