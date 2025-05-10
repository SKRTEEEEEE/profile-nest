import { Controller, Get, Post, Query } from "@nestjs/common";
import { PreTechService } from "src/application/usecases/entities/pre-tech.service";
import { MongoosePreTechReadMeta } from "src/infrastructure/mongoose/entities/pre-tech.repo";
import { MongooseBase } from "src/infrastructure/mongoose/types";
import { PublicRoute } from "../decorators/public-route.decorator";

@Controller("/pre-tech")
export class PreTechController {
    constructor(private readonly PreTechService: PreTechService<MongooseBase, MongoosePreTechReadMeta>){}

    @Post()
    async updatePreTech(): Promise<void> {
        return await this.PreTechService.updatePreTech();
    }

    
    @Get()
    @PublicRoute() // Esto es un decorador, en este caso el de ruta publica -> public-route.decorator.ts
    async readPreTechByQuery(
        @Query("q") query: string,
    ): Promise<PreTech<MongooseBase>[]> {
        console.log("Query in get pre-tech:", query);
        return await this.PreTechService.readByQuery(query);
    }

}