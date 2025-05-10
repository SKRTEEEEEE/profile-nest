import { MongooseBase, MongooseDocument } from "../types";
import { MongooseCRUI, MongooseUpdateByIdProps } from "../types/implementations";
import { MongooseBaseImpl } from "./base";

export class MongooseCRUImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseCRUI<TBase>{
    async create(data: Omit<TBase, 'id'>): Promise<TBase & MongooseBase> {
        await this.connect();
        const newDocument: TBase & MongooseDocument = new this.Model(data);
        const savedDocument = await newDocument.save();
        return this.documentToPrimary(savedDocument);
      }
    
      async readById(id: string): Promise<TBase & MongooseBase | null> {
        await this.connect();
        const document: TBase & MongooseDocument|null = await this.Model.findById(id);
        return document ? this.documentToPrimary(document) : null;
      }
    
      async updateById(
        {id, updateData, options}: MongooseUpdateByIdProps<TBase>
      ): Promise<TBase & MongooseBase | null> {
        await this.connect();
        const updatedDocument: TBase & MongooseDocument|null = await this.Model.findByIdAndUpdate(id, updateData, (options ? options: {
          new: true,
        }));
        return updatedDocument ? this.documentToPrimary(updatedDocument) : null;
      }
}