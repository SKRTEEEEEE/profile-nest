import { Model, Query } from "mongoose";
import { MongooseBaseImpl } from "../implementations/base";
import { MongooseCRUImpl } from "../implementations/cru.impl";
import { MongooseDeleteByIdImpl, MongooseDeleteImpl } from "../implementations/delete.impl";
import { MongooseReadImpl } from "../implementations/read.impl";
import { MongooseBase } from "../types";
import { MongooseDeleteProps, MongooseReadProps, MongooseReadResponse, MongooseUpdateByIdProps } from "../types/implementations";
import { MongooseCRRUDD } from "../types/patterns";

export abstract class MongooseCRRUDDPattern<
TBase> extends MongooseBaseImpl<TBase> implements MongooseCRRUDD<TBase>{
  private cruRepo: MongooseCRUImpl<TBase>
  private readRepo: MongooseReadImpl<TBase>;
  private deleteByIdRepo: MongooseDeleteByIdImpl<TBase>;
  private deleteRepo: MongooseDeleteImpl<TBase>

  constructor(Model: Model<any, {}, {}, {}, any, any>) {
    super(Model);

    this.readRepo = new MongooseReadImpl(this.Model);
    this.deleteByIdRepo = new MongooseDeleteByIdImpl(this.Model);
    this.deleteRepo = new MongooseDeleteImpl(this.Model)
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
  async updateById(props: MongooseUpdateByIdProps<TBase>
  )
    : Promise<TBase & MongooseBase | null> {
      return await this.cruRepo.updateById(props)
    }
  // Implementar el método delete
  async deleteById(id: string): Promise<boolean> {
    return this.deleteByIdRepo.deleteById(id);
    
  }
  async read(
    props: MongooseReadProps<TBase>
  ): MongooseReadResponse<TBase> {
    return await this.readRepo.read(props);
  }
  async delete(props: MongooseDeleteProps<TBase>): Promise<Query<any, any, {}, any, "findOneAndDelete", {}>>{
    return this.deleteRepo.delete(props)
  }
}