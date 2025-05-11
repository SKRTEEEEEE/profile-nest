import { Model } from "mongoose";
import { MongooseBaseImpl } from "../implementations/base";
import { MongooseCRUImpl, MongooseUpdateByIdProps } from "../implementations/cru.impl";
import { MongooseDeleteByIdImpl, MongooseDeleteByIdRes, MongooseDeleteImpl, MongooseDeleteProps, MongooseDeleteRes } from "../implementations/delete.impl";
import { MongooseReadImpl, MongooseReadProps, MongooseReadResponse } from "../implementations/read.impl";
import { MongooseBase } from "../types";
import { MongooseCRRUDD } from "../types/patterns";

export abstract class MongooseCRRUDDPattern<
TBase> extends MongooseBaseImpl<TBase> implements MongooseCRRUDD<TBase>{
  constructor(
    Model: Model<any, {}, {}, {}, any, any>,
    private cruRepo: MongooseCRUImpl<TBase>,
  private readRepo: MongooseReadImpl<TBase>,
  private deleteByIdRepo: MongooseDeleteByIdImpl<TBase>,
  private deleteRepo: MongooseDeleteImpl<TBase>
  ) {
    super(Model);
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
  async updateById(props: MongooseUpdateByIdProps<TBase>
  )
    : Promise<TBase & MongooseBase | null> {
      return await this.cruRepo.updateById(props)
    }
  // Implementar el método delete
  async deleteById(id: string): MongooseDeleteByIdRes<TBase> {
    return this.deleteByIdRepo.deleteById(id);
    
  }
  async read(
    props: MongooseReadProps<TBase>
  ): MongooseReadResponse<TBase> {
    return await this.readRepo.read(props);
  }
  async delete(props: MongooseDeleteProps<TBase>): MongooseDeleteRes<TBase>{
    return this.deleteRepo.delete(props)
  }
}