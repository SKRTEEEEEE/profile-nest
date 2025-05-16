import { Model } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseCRRUUD, MongooseCRRUUDid } from "../types/patterns";
import { MongooseBaseImpl } from "../implementations/base";
import { MongooseCRUImpl, MongooseUpdateByIdProps } from "../implementations/cru.impl";
import { MongooseReadImpl, MongooseReadProps, MongooseReadResponse } from "../implementations/read.impl";
import { MongooseUpdateImpl, MongooseUpdateProps } from "../implementations/update.impl";
import { MongooseDeleteImpl, MongooseDeleteProps } from "../implementations/delete.impl";

export abstract class MongooseCRRUUDPattern<
  TBase,
  TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions> implements MongooseCRRUUD<TBase> {
  


  constructor(
    Model: Model<any, {}, {}, {}, any, any>,
    private cruRepo: MongooseCRUImpl<TBase>,
    private readRepo: MongooseReadImpl<TBase>,
    private updateRepo: MongooseUpdateImpl<TBase>,
    private deleteRepo: MongooseDeleteImpl<TBase>,
    parseOpt?: TOptions) {
    super(Model, parseOpt);
  }
  async create(
    data: Omit<TBase, 'id'>
  )
     {
    return await this.cruRepo.create(data)
  }
  async readById(
    id: string
  )
     {
    return await this.cruRepo.readById(id)
  }
  async read(
    props: MongooseReadProps<TBase>
  ): MongooseReadResponse<TBase> {
    return await this.readRepo.read(props);
  }
  async updateById(props:MongooseUpdateByIdProps<TBase>
  )
    {
    return await this.cruRepo.updateById(props)
  }
  async update(props: MongooseUpdateProps<TBase>) {
    return await this.updateRepo.update(props)
  }
  // Implementar el método delete
  async delete(props: MongooseDeleteProps<TBase>): DeleteRes<TBase, MongooseBase> {
    return await this.deleteRepo.delete(props);
  }

}
