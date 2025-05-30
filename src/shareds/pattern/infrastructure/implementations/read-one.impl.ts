// export type MongooseReadOneProps<TB> = {

import { Model, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
import { MongooseBase } from "../types";
import { MongooseBaseImpl } from "./base";
import {  DatabaseFindError } from "src/domain/flows/domain.error";

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
            throw new DatabaseFindError("readOne",MongooseReadOneImpl,{optionalMessage: "Error en la operación de lectura"})
        }
    }
}
