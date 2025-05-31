import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { RoleType } from "src/domain/entities/role.type";

import { PreTechEndpointUseCase } from "../application/pre-tech.usecase";
import { RoleAuthTokenGuard } from "src/shareds/role-auth/presentation/role-auth-token.guard";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { Roles } from "src/shareds/role-auth/presentation/role.decorator";
import { QueryDto } from "src/shareds/presentation/pipes/query.dto";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { ResCodes } from "src/domain/flows/res.codes";
import { PreTechInterface } from "../application/pre-tech.interface";
import { ApiBearerAuth, ApiExcludeEndpoint } from "@nestjs/swagger";
import { NotImplementedError, UnauthorizedError } from "src/domain/flows/domain.error";
import { ApiSuccessResponse } from "src/shareds/presentation/api-success.decorator";
import { MongoosePreTechDto } from "./pre-tech.dto";
import { ApiErrorResponse } from "src/shareds/presentation/api-error.decorator";



@Controller("/pre-tech")
export class PreTechController implements PreTechInterface<MongooseBase> {
    constructor(private readonly preTechEndpointService: PreTechEndpointUseCase<MongooseBase>){} // Esto proviene de /app y no depende de ninguna librería tansolo del domain(typescript puro)
    // constructor(private readonly preTechEndpointService: MongoosePreTechRepo){} // Esto proviene de /infra

    @Post()
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(MongoosePreTechDto,ResCodes.ENTITY_UPDATED)
    @ApiBearerAuth("access-token")
    @UseGuards(RoleAuthTokenGuard)
    @Roles(RoleType.ADMIN)
    async updatePreTech(): Promise<void> {
        return await this.preTechEndpointService.updatePreTech();
    }

    
    // @ApiOkResponse(
        //     ResCodes.ENTITIES_FOUND,
        //     "Hola mundo"
        // ) // Sobre-escribe la respuesta por defecto - recomendado siempre -> Decorator opcional para dar mas info del endpoint en la respuesta 
    @Get()
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(MongoosePreTechDto,ResCodes.ENTITIES_FOUND, true)
    @PublicRoute() // No se usara
    // @UseGuards(RoleAuthTokenGuard)
    // @Roles(RoleType.STUDENT, RoleType.ADMIN) // Utiliza el de mayor rango -> admin
    // // @Roles() // Actuara como una ruta protegida normal (token validado - sin rol -> pasara ok)
    async readByQuery(
        @Query() query: QueryDto,
    ): Promise<PreTech<MongooseBase>[]> {
        return await this.preTechEndpointService.readByQuery(query);
    }
}