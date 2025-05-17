import { QueryOptions, UpdateQuery } from "mongoose";
import { MongooseBase, MongooseDocument } from "../types";
import { MongooseBaseImpl } from "./base";
import { DatabaseActionError } from "src/domain/flows/domain.error";
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
            throw new DatabaseActionError("save",{optionalMessage:"Failed to save the document"});
          }
          return this.documentToPrimary(savedDocument);
        } catch (error) {
          console.error("Error al crear el documento:", error);
          throw new DatabaseActionError("create",{optionalMessage:"Failed to create the document"});
        }
      }
    
      async readById(id: string): ReadByIdRes<TBase , MongooseBase > {
        try {
          const document = await this.Model.findById(id);
          if (!document) {
            throw new DatabaseActionError("findById",{optionalMessage:"Failed to find the document"});
          }
          return this.documentToPrimary(document);
        } catch (error) {
          console.error("Error al leer el documento:", error);
          throw new DatabaseActionError("readById",{optionalMessage:"Failed to read the document"});
        }
      }
    
      async updateById(
        {id, updateData, options}: MongooseUpdateByIdProps<TBase>
      ): UpdateByIdRes<TBase, MongooseBase>{
        try {
          const updatedDocument = await this.Model.findByIdAndUpdate(id, updateData, (options ? options: {
          new: true,
        }));
        if(!updatedDocument) throw new DatabaseActionError("findByIdAndUpdate",{optionalMessage:"Failed to update the document"});
        return  this.documentToPrimary(updatedDocument) 
        } catch (error) {
          console.error("Error al actualizar el documento:", error);
          throw new DatabaseActionError("updateById",{optionalMessage:"Failed to update the document"});
          
        }
      }
}