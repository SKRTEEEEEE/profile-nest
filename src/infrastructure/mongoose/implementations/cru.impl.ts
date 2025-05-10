import { MongooseBase, MongooseDocument } from "../types";
import { MongooseCRUI, MongooseUpdateByIdProps } from "../types/implementations";
import { MongooseBaseImpl } from "./base";

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