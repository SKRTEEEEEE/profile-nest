import mongoose, { Document, QueryOptions, UpdateQuery } from "mongoose"


export type MongooseBase = {
  id: string
  createdAt: string
  updatedAt: string
}
export type MongooseTimestamps = {
  createdAt: Date;
  updatedAt: Date;
}
export type MongooseDocument = Document
