import { ModifyResult, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";
import { MongooseBase, MongooseDocument } from "../types";
import { MongooseBaseImpl } from "./base";
export type MongooseUpdateProps<TBase> = {
    filter: RootFilterQuery<TBase & MongooseBase>, 
    update: UpdateQuery<TBase & MongooseBase>, 
    options: QueryOptions<TBase & MongooseBase> & {
        includeResultMetadata: true;
        lean: true;
    }
}
export type MongooseUpdateI<TBase> = {
    update(props: MongooseUpdateProps<TBase>): Promise<(TBase & MongooseBase)|null>
}
export class MongooseUpdateImpl<
TBase,
> extends MongooseBaseImpl <TBase> implements MongooseUpdateI<TBase> {
    async update({filter, update, options}: MongooseUpdateProps<TBase>): Promise<(TBase & MongooseBase) | null> {
        const updatedDocument: ModifyResult<TBase & MongooseDocument>|null = await this.Model.findOneAndUpdate(filter, update, options)
        return updatedDocument ? this.documentToPrimary(updatedDocument.value as TBase & MongooseDocument) as TBase & MongooseBase: null
    }}