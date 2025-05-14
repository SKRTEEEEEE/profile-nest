import { ModifyResult, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";
import { MongooseBase, MongooseDocument } from "../types";
import { MongooseBaseImpl } from "./base";
import { DatabaseActionError } from "src/domain/errors/domain.error";
export type MongooseUpdateProps<TBase> = {
    filter: RootFilterQuery<TBase & MongooseBase>, 
    update: UpdateQuery<TBase & MongooseBase>, 
    options: QueryOptions<TBase & MongooseBase> & {
        includeResultMetadata: true;
        lean: true;
    }
}
export type MongooseUpdateI<TBase> = {
    update(props: MongooseUpdateProps<TBase>): Promise<(TBase & MongooseBase)>
}
export class MongooseUpdateImpl<
TBase,
> extends MongooseBaseImpl <TBase> implements MongooseUpdateI<TBase> {
    async update({filter, update, options}: MongooseUpdateProps<TBase>): Promise<(TBase & MongooseBase) > {
        try {
            const updatedDocument: ModifyResult<TBase & MongooseDocument>|null = await this.Model.findOneAndUpdate(filter, update, options)
            return this.documentToPrimary(updatedDocument.value as TBase & MongooseDocument) as TBase & MongooseBase
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            throw new DatabaseActionError("update", {optionalMessage:"Error en la operación de actualización"});
        }
    }}