import mongoose, { Document, QueryOptions, UpdateQuery } from 'mongoose';

export type MongooseTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};
export type MongooseDocument = Document;
