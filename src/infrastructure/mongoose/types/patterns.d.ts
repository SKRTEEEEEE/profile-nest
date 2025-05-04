import { MongooseCRUI, MongooseDeleteByIdI,  MongooseDeleteI,  MongooseReadI, MongooseUpdateI } from "./implementations";

export type MongooseCRRUUD1<TBase> = MongooseCRUI<TBase> & MongooseReadI<TBase> & MongooseUpdateI<TBase> & MongooseDeleteByIdI
export type MongooseCRRUUD2<TBase> = MongooseCRUI<TBase> & MongooseReadI<TBase> & MongooseUpdateI<TBase> & MongooseDeleteI
export type MongooseRp<TBase> =  MongooseReadI<TBase> & MongoosePopulateI<TBase>