// export type MongooseReadOneProps<TB> = {

import { Model, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseBaseImpl } from "./base";
import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";

export type MongooseReadOneI<TB> = {
    readOne(
        props: MongooseReadOneProps<TB>
    ): MongooseReadOneRes<TB>
}
export type MongooseReadOneRes<TB> = ReadOneRes<TB, MongooseBase> 
export type MongooseReadOneProps<TB> = {
    filter?: RootFilterQuery<TB>,
    projection?: ProjectionType<TB> | null,
    options?: QueryOptions<TB> | null
}
export class MongooseReadOneImpl<
TBase,
TOptions extends Partial<Record<keyof TBase & MongooseBase, (value: any) => any>> = {}
> extends MongooseBaseImpl<TBase, TOptions>
implements MongooseReadOneI<TBase>
{
    constructor(Model: Model<TBase & MongooseBase>, parseOpt?: TOptions){
        super(Model, parseOpt);
    }
    async readOne(
        props: MongooseReadOneProps<TBase>
    ){
        try {
            const doc = await this.Model.findOne(props.filter, props.projection, props.options)
            return doc 
        } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseReadOneImpl, 'readOne', undefined, { optionalMessage: 'Error en la operación de lectura' })
        }
    }
}
