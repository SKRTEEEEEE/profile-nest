import { Controller, Get, Post, Query } from "@nestjs/common";
import { PreTech } from "src/domain/entities/pre-tech";
import { MongoosePreTechRepo } from "src/infrastructure/mongoose/entities/pre-tech.repo";
import { MongooseBase } from "src/infrastructure/mongoose/types";

@Controller("/pre-tech")
export class PreTechController {
    constructor(private readonly mongoosePreTechRepo: MongoosePreTechRepo){}

    @Post()
    async updatePreTech(): Promise<void> {
        return await this.mongoosePreTechRepo.updatePreTech();
    }

    @Get()
    async readPreTechByQuery(
        @Query("q") query: string,
    ): Promise<PreTech<MongooseBase>[]> {
        console.log("Query in get pre-tech:", query);
        return await this.mongoosePreTechRepo.readByQuery(query);
    }

}