import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { RoleType } from "src/domain/entities/role.type";

import { PreTechEndpointUseCase } from "../application/pre-tech.usecase";
import { RoleAuthTokenGuard } from "src/shareds/role-auth/presentation/role-auth-token.guard";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { Roles } from "src/shareds/role-auth/presentation/role.decorator";
import { QueryDto } from "src/shareds/presentation/pipes/query.dto";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { ResCodes } from "src/domain/flows/res.type";
import { PreTechInterface } from "../application/pre-tech.interface";
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from "@nestjs/swagger";
import { NotImplementedError, UnauthorizedError } from "src/domain/flows/domain.error";
import { ApiSuccessResponse } from "src/shareds/presentation/api-success.decorator";
import { PreTechDto } from "./pre-tech.dto";
import { ApiErrorResponse } from "src/shareds/presentation/api-error.decorator";


@ApiTags("Pre Tech")
@Controller("/pre-tech")
export class PreTechController implements PreTechInterface<MongooseBase> {
    constructor(private readonly preTechEndpointService: PreTechEndpointUseCase<MongooseBase>){} // Esto proviene de /app y no depende de ninguna librería tan solo del domain(typescript puro)
    // constructor(private readonly preTechEndpointService: MongoosePreTechRepo){} // Esto proviene de /infra

    @Post()
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(PreTechDto,ResCodes.ENTITY_UPDATED)
    @ApiOperation({
        summary: "🆕 Update - Add new technologies if available",
        description: `Adds new technologies to the system if they are available and not already present.

- 🛡️ **Protected endpoint**: Requires ADMIN role and a valid access token.
- ➕ **Operation**: Adds new technologies; edit existing technologies if required.
- 📝 **Request body**: No body required. The system will fetch and compare available technologies automatically.
- ✅ **Response**: Returns the list of newly added technologies, including their database metadata (id, createdAt, updatedAt).

Use this endpoint to keep the technology catalog updated with the latest additions.`
    })
    @UseGuards(RoleAuthTokenGuard)
    @Roles(RoleType.ADMIN)
    async updatePreTech(): Promise<void> {
        return await this.preTechEndpointService.updatePreTech();
    }
    @Get()
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(PreTechDto,ResCodes.ENTITIES_FOUND, true)
    @ApiOperation({
        summary: `📖 Read - By query (nameId and nameBadge)`,
        description: `Returns a list of available technologies filtered by query parameters such as nameId and nameBadge.

- 🌐 **Public endpoint**: No authentication required.
- 🔎 **Query parameters**: Filter by any field present in the technology (e.g., nameId, nameBadge, color, web).
- 📦 **Response**: Returns an array of PreTech objects with all their properties, including database metadata (id, createdAt, updatedAt). Can be empty.

Useful for listing, searching, or filtering technologies in the application.`
    })
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