import { QueryOptions, UpdateQuery } from "mongoose";
import { MongooseBase, MongooseDocument } from "../types";
import { MongooseBaseImpl } from "./base";
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
export class MongooseCRUImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseCRUI<TBase>{
    async create(data: Omit<TBase, 'id'>): Promise<TBase & MongooseBase> {
        const newDocument: TBase & MongooseDocument = new this.Model(data);
        const savedDocument = await newDocument.save();
        return this.documentToPrimary(savedDocument);
      }
    
      async readById(id: string): Promise<TBase & MongooseBase | null> {
        const document: TBase & MongooseDocument|null = await this.Model.findById(id);
        return document ? this.documentToPrimary(document) : null;
      }
    
      async updateById(
        {id, updateData, options}: MongooseUpdateByIdProps<TBase>
      ): Promise<TBase & MongooseBase | null> {
        const updatedDocument: TBase & MongooseDocument|null = await this.Model.findByIdAndUpdate(id, updateData, (options ? options: {
          new: true,
        }));
        return updatedDocument ? this.documentToPrimary(updatedDocument) : null;
      }
}