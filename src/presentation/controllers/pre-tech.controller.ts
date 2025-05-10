import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PreTechService } from "src/application/usecases/entities/pre-tech.service";
import { JwtAuthUserGuard } from "src/presentation/guards/jwt-auth-user.guard";
import { MongoosePreTechReadMeta } from "src/infrastructure/mongoose/entities/pre-tech.repo";
import { MongooseBase } from "src/infrastructure/mongoose/types";

// He de cambiar a un enfoque donde todas las rutas utilizan JwtAuthUserGuard y solo las que ten con el decorador publicRoute tengan acceso

@Controller("/pre-tech")
export class PreTechController {
    constructor(private readonly PreTechService: PreTechService<MongooseBase, MongoosePreTechReadMeta>){}

    @Post()
    @UseGuards(JwtAuthUserGuard)
    async updatePreTech(): Promise<void> {
        return await this.PreTechService.updatePreTech();
    }

    // Esta ruta sera pública
    @Get()
    @UseGuards(JwtAuthUserGuard)
    async readPreTechByQuery(
        @Query("q") query: string,
    ): Promise<PreTech<MongooseBase>[]> {
        console.log("Query in get pre-tech:", query);
        return await this.PreTechService.readByQuery(query);
    }

}