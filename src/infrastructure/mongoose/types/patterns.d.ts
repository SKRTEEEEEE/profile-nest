import { MongooseBase } from ".";
import { MongooseCRUI, MongooseDeleteByIdI,  MongooseDeleteI,  MongooseReadI, MongooseUpdateI } from "./implementations";

type MongooseCRRUUD1<TBase> = 
MongooseCRUI<TBase> & 
MongooseReadI<TBase> & 
MongooseUpdateI<TBase> & 
MongooseDeleteByIdI

type MongooseCRRUUD2<TBase> = 
MongooseCRUI<TBase> & 
MongooseReadI<TBase> & 
MongooseUpdateI<TBase> & 
MongooseDeleteI<TBase>

type MongooseRp<TBase> =  
MongooseReadI<TBase> & 
MongoosePopulateI<TBase>

// interface MongooseCRRUDD<TBase> extends MongooseCRUI<TBase> , MongooseReadI<TBase>, MongooseDeleteI<TBase> ,MongooseDeleteByIdI<TBase> {}

type MongooseCRRUDD<TBase> = 
MongooseCRUI<TBase> &
MongooseReadI<TBase> &
MongooseDeleteI<TBase> & 
MongooseDeleteByIdI