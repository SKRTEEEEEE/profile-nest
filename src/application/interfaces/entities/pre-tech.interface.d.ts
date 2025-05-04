import { MongoosePopulateRepository } from "@/core/infrastructure/mongoose/implementations/populate.repository";
import { MongooseReadRepository } from "@/core/infrastructure/mongoose/implementations/read.repository";
import { MongooseBase } from "@/core/infrastructure/mongoose/types";
import { PopulateRepository } from "src/domain/interfaces/populate";
import { ReadRepository } from "src/domain/interfaces/read";

export type PreTechRepository<TBase,TDBBase, Meta extends ReadMeta<TBase>> = ReadRepository<TBase, Meta> & PopulateRepository<TBase, TDBBase> & {
    readByName(name: string): Promise<TBase & TDBBase>;
    updatePreTech(): Promise<void>;
    readByQuery(query: string): Promise<TBase & TDBBase[]>;
}