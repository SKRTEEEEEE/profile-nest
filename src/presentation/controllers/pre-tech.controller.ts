import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PreTechService } from "src/application/usecases/entities/pre-tech.service";
import { MongooseBase } from "src/infrastructure/mongoose/types";
import { RoleAuthTokenGuard } from "../guards/role-auth-token.guard";
import { RoleType } from "src/domain/entities/role.type";
import { Roles } from "../decorators/role.decorator";
import { PublicRoute } from "../decorators/public-route.decorator";
import { QueryDto } from "../pipes/query.dto";


@Controller("/pre-tech")
export class PreTechController {
    constructor(private readonly PreTechService: PreTechService<MongooseBase>){}

    @Post()
    async updatePreTech(): Promise<void> {
        return await this.PreTechService.updatePreTech();
    }

    
    @Get()
    @PublicRoute() // No se usara
    // @UseGuards(RoleAuthTokenGuard)
    // @Roles(RoleType.STUDENT, RoleType.ADMIN) // Utiliza el de mayor rango -> admin
    // // @Roles() // Actuara como una ruta protegida normal (token validado)
    async readPreTechByQuery(
        @Query() query: QueryDto,
    ): Promise<PreTech<MongooseBase>[]> {
        return await this.PreTechService.readByQuery(query.q);
    }

}