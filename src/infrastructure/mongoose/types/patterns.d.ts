import { MongooseBase } from ".";
import { MongooseCRUI } from "../implementations/cru.impl";
import { MongooseDeleteByIdI, MongooseDeleteI } from "../implementations/delete.impl";
import { MongoosePopulateI } from "../implementations/populate.impl";
import { MongooseReadI } from "../implementations/read.impl";
import { MongooseUpdateI } from "../implementations/update.impl";

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


type MongooseCRRUDD<TBase> = 
MongooseCRUI<TBase> &
MongooseReadI<TBase> &
MongooseDeleteI<TBase> & 
MongooseDeleteByIdI<TBase>