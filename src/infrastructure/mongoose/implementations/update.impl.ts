import { MongooseBase, MongooseDocument } from "../types";
import { MongooseUpdateI, MongooseUpdateProps } from "../types/implementations";
import { MongooseBaseImpl } from "./base";

export class MongooseUpdateImpl<
TBase,
> extends MongooseBaseImpl <TBase> implements MongooseUpdateI<TBase> {
    async update({filter, update, options}: MongooseUpdateProps<TBase>): Promise<(TBase & MongooseBase) | null> {
        await this.connect()
        const updatedDocument: TBase & MongooseDocument|null = await this.Model.findOneAndUpdate(filter, update, options)
        return updatedDocument ? this.documentToPrimary(updatedDocument) as TBase & MongooseBase: null
    }
}