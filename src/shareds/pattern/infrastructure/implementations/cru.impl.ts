import { QueryOptions, UpdateQuery } from "mongoose";
import { MongooseBase, MongooseDocument } from "../types";
import { MongooseBaseImpl } from "./base";
import { DatabaseActionError, DatabaseFindError } from "src/domain/flows/domain.error";
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
    : Promise<TBase & MongooseBase >
  updateById(
    props: MongooseUpdateByIdProps<TBase>
  )
    : Promise<TBase & MongooseBase >
}
export class MongooseCRUImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseCRUI<TBase>{
    async create(data: Omit<TBase, 'id'>): CreateRes<TBase, MongooseBase> {
        try {
          const newDocument: TBase & MongooseDocument = new this.Model(data);
          const savedDocument = await newDocument.save();
          if (!savedDocument) {
            throw new DatabaseActionError("Document.save",MongooseCRUImpl,{optionalMessage:"Failed to save the document"});
          }
          return this.documentToPrimary(savedDocument);
        } catch (error) {
          throw new DatabaseActionError("create",MongooseCRUImpl,{optionalMessage:"Failed to create the document"});
        }
      }
    
      async readById(id: string): ReadByIdRes<TBase , MongooseBase > {
        try {
          const document = await this.Model.findById(id);
          if (!document) {
            throw new DatabaseFindError("Model.findById",MongooseCRUImpl,{optionalMessage:"Failed to find the document"});
          }
          return this.documentToPrimary(document);
        } catch (error) {
          throw new DatabaseFindError("readById",MongooseCRUImpl, {optionalMessage:"Failed to read the document"});
        }
      }
    
      async updateById(
        {id, updateData, options}: MongooseUpdateByIdProps<TBase>
      ): UpdateByIdRes<TBase, MongooseBase>{
        try {
          const updatedDocument = await this.Model.findByIdAndUpdate(id, updateData, (options ? options: {
          new: true,
        }));
        if(!updatedDocument) throw new DatabaseActionError("Model.findByIdAndUpdate",MongooseCRUImpl, {optionalMessage:"Failed to update the document"});
        return  this.documentToPrimary(updatedDocument) 
        } catch (error) {
          throw new DatabaseActionError("updateById",MongooseCRUImpl, {optionalMessage:"Failed to update the document"});
          
        }
      }
}