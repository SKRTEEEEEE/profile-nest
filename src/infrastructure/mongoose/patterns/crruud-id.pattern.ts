import { Model } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseCRRUUDid } from "../types/patterns";
import { MongooseBaseImpl } from "../implementations/base";
import { MongooseCRUImpl, MongooseUpdateByIdProps } from "../implementations/cru.impl";
import { MongooseReadImpl, MongooseReadProps, MongooseReadResponse } from "../implementations/read.impl";
import { MongooseUpdateImpl, MongooseUpdateProps } from "../implementations/update.impl";
import { MongooseDeleteByIdImpl } from "../implementations/delete.impl";

/* 
  - crruud v1

  deleteById
*/
export abstract class MongooseCRRUUDidPattern<
  TBase,
  TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions> implements MongooseCRRUUDid<TBase> {
  


  constructor(
    Model: Model<any, {}, {}, {}, any, any>, 
    private cruRepo: MongooseCRUImpl<TBase>,
    private readRepo: MongooseReadImpl<TBase>,
    private updateRepo: MongooseUpdateImpl<TBase>,
    private deleteRepo: MongooseDeleteByIdImpl<TBase>,
    parseOpt?: TOptions) {
    super(Model, parseOpt);

    this.readRepo = new MongooseReadImpl(this.Model);
    this.deleteRepo = new MongooseDeleteByIdImpl(this.Model);
    this.updateRepo = new MongooseUpdateImpl(this.Model)
    this.cruRepo = new MongooseCRUImpl(this.Model)

  }
  async create(
    data: Omit<TBase, 'id'>
  )
    : Promise<TBase & MongooseBase> {
    return await this.cruRepo.create(data)
  }
  async readById(
    id: string
  )
    : Promise<TBase & MongooseBase | null> {
    return await this.cruRepo.readById(id)
  }
  async read(
    props: MongooseReadProps<TBase>
  ): MongooseReadResponse<TBase> {
    return await this.readRepo.read(props);
  }
  async updateById(props:MongooseUpdateByIdProps<TBase>
  )
    : Promise<TBase & MongooseBase | null> {
    return await this.cruRepo.updateById(props)
  }
  async update(props: MongooseUpdateProps<TBase>): Promise<TBase & MongooseBase | null> {
    return await this.updateRepo.update(props)
  }
  // Implementar el método delete
  async deleteById(id: string): DeleteByIdRes<TBase, MongooseBase> {
    return await this.deleteRepo.deleteById(id);
  }

}
