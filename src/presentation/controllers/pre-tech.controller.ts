import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PreTechEndpointService } from "src/application/usecases/entities/pre-tech.service";
import { MongooseBase } from "src/infrastructure/mongoose/types";
import { PublicRoute } from "../decorators/public-route.decorator";
import { QueryDto } from "../pipes/query.dto";
import { RoleAuthTokenGuard } from "../guards/role-auth-token.guard";
import { RoleType } from "src/domain/entities/role.type";
import { Roles } from "../decorators/role.decorator";



@Controller("/pre-tech")
export class PreTechController  {
    constructor(private readonly preTechEndpointService: PreTechEndpointService<MongooseBase>){} // Esto proviene de /app y no depende de ninguna librería tansolo del domain(typescript puro)
    // constructor(private readonly preTechEndpointService: MongoosePreTechRepo){} // Esto proviene de /infra

    @Post()
    async updatePreTech(): Promise<void> {
        return await this.preTechEndpointService.updatePreTech();
    }

    
    @Get()
    @PublicRoute() // No se usara
    @UseGuards(RoleAuthTokenGuard)
    @Roles(RoleType.STUDENT, RoleType.ADMIN) // Utiliza el de mayor rango -> admin
    // // @Roles() // Actuara como una ruta protegida normal (token validado)
    async readByQuery(
        @Query() query: QueryDto,
    ): Promise<PreTech<MongooseBase>[]> {
        return await this.preTechEndpointService.readByQuery(query.q);
    }
}