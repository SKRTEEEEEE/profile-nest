import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { TechForm } from "src/domain/entities/tech";
import { TechReadUseCase } from "../application/tech-read.usecase";
import { TechDeleteUseCase, TechReadByIdUseCase, TechUpdateByIdUseCase, TechUpdateUseCase } from "../application/tech.usecase";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { TechOctokitCreateRepo } from "src/modules/tech/infrastructure/tech-octokit/create.repo";
import { ActualizarGithubType, TechOctokitActualizarGithubRepo } from "../infrastructure/tech-octokit/actualizar.repo";
import { InputParseError } from "src/domain/flows/domain.error";
import { TechOctokitUpdateRepo } from "../infrastructure/tech-octokit/update.repo";
import { TechFindDeleteRepo } from "../infrastructure/delete.repo";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { FullTechDataDto, LangDto, TechFormDto } from "./tech.dto";
import { ApiErrorResponse } from "src/shareds/presentation/api-error.decorator";
import { ErrorCodes } from "src/domain/flows/error.type";
import { ApiSuccessResponse } from "src/shareds/presentation/api-success.decorator";
import { ResCodes } from "src/domain/flows/res.type";
import { ActualizarGithubParams, ReadAllParams } from "src/domain/entities/tech.type";
import { VoidDto } from "src/shareds/presentation/pipes/void.dto";




@ApiTags("Tech")
@Controller("/tech")
export class TechController {
    constructor(
        // private readonly techCreateService: TechCreateUseCase<MongooseBase>,
        private readonly techOctokitUpdateRepo: TechOctokitUpdateRepo,
        private readonly techOctokitActualizarGithubRepo: TechOctokitActualizarGithubRepo,
        private readonly techOctokitCreateRepo: TechOctokitCreateRepo,
        private readonly techFindAndDeleteRepo: TechFindDeleteRepo,
        private readonly techReadService: TechReadUseCase<MongooseBase>,
        // private readonly techReadByIdService: TechReadByIdUseCase<MongooseBase>,
        // private readonly techUpdateService: TechUpdateUseCase<MongooseBase>,
        // private readonly techUpdateByIdService: TechUpdateByIdUseCase<MongooseBase>,
        // private readonly techDeleteService: TechDeleteUseCase<MongooseBase>
    ) {}

    @Delete("/:nameId")
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(LangDto, ResCodes.ENTITY_DELETED)
    @ApiOperation({
    summary: "🗑️ Delete - Remove technology by nameId",
    description: `Deletes a technology and all its associated data by its unique nameId.

- 🛡️ **Protected endpoint**: Requires and a valid access token.
- 🗝️ **Parameter**: \`nameId\` (string) — Unique identifier for the technology to delete.
- ✅ **Response**: Returns the deleted technology object, including its database metadata (id, createdAt, updatedAt).

Use this endpoint to permanently remove a technology from the system.`
})
    async delete(@Param("nameId") nameId: string) {
        return await this.techFindAndDeleteRepo.findAndDelete(nameId)
    }

    @Get("/:type") //can be: /db, /flatten, /cat
    @PublicRoute()
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(FullTechDataDto, ResCodes.ENTITIES_FOUND, true) //Hay que mostrar lo que devuelve
    @ApiParam({name: "type", enum: ReadAllParams})
    @ApiOperation({
        summary: `📖 Read - All (db, flatten, cat, full)`,
        description: `Returns a list of available technologies with different formats.

- 🌐 **Public endpoint**: No authentication required.
- 🗝️ **Parameter**: \`type\` (string) 
    - Db: nested format 
    - Flatten: flatten format
    - Cat: used langs and fws (not libs)
    - Full: all data (db, flatten and cat)

- 📦 **Response**: Depends on the type parameter

Useful for listing, searching, or filtering technologies in the application.`
    })
    async readAll(@Param("type") type: ReadAllParams) {
        switch(type)
            {
                case ReadAllParams.Category:
                    return await this.techReadService.readAllCat()
                case ReadAllParams.Full:
                    const res = await this.techReadService.readAllC();
                    console.log(res)
                    return res
                case ReadAllParams.Db:
                    return await this.techReadService.readAll()
                case ReadAllParams.Flatten:
                    return await this.techReadService.readAllFlatten()
            }
 
        
    }

    @Post("/:type") // can be /all or /json or /md
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(VoidDto, ResCodes.OPERATION_SUCCESS)
    @ApiParam({name: "type", enum: ActualizarGithubParams})
    @ApiOperation({
        summary: `♻️ Update - Github (all, json, md)`,
        description: `Update the actual info in Github

- 🛡️ **Protected endpoint**: Requires and a valid access token.
- 🗝️ **Parameter**: \`type\` (string) 
    - All: Update info in json and markdown Github files 
    - Json: Update info in json Github file
    - Md: Update info in markdown Github file

- 📦 **Response**: No special response, only the Flow Response

Useful for manage specials flow of the app.`
    })
    async actualizarGithub(@Param("type") type: ActualizarGithubParams){
        if(!Object.values(ActualizarGithubType).includes(type))throw new InputParseError(TechController,"Invalid route")
        return await this.techOctokitActualizarGithubRepo.actualizar({type:ActualizarGithubType[type]})
    }
    
    @Put()
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    // @ApiSuccessResponse()//falta mejorar la Respuesta!
    async update(@Body() tech: TechFormDto) {
        return await this.techOctokitUpdateRepo.update(tech)
    }

    @Post()
    @ApiBearerAuth("access-token")
    @ApiErrorResponse(ErrorCodes.INPUT_PARSE , ErrorCodes.DATABASE_FIND)
    //@ApiSuccessResponse()//falta mejorar la Respuesta!
    @ApiOperation({
        summary: "🆕 Create - Add new technologies",
        description: `Adds new technologies to the system.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- ➕ **Operation**: Add new technology.
- 📝 **Request body**: Tech Form. Provide all the required info.
- ✅ **Response**: Returns the list of newly added technologies, including their database metadata (id, createdAt, updatedAt).

Use this endpoint to keep the technology catalog updated with the latest additions.`
    })
    async create(@Body() tech: TechFormDto) {
        return await this.techOctokitCreateRepo.create(tech)
    }
}