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
import { ApiBearerAuth } from "@nestjs/swagger";
import { TechFormDto } from "./tech.dto";
import { ApiErrorResponse } from "src/shareds/presentation/api-error.decorator";
import { ErrorCodes } from "src/domain/flows/error.codes";

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

    @ApiBearerAuth("access-token")
    @Delete()
    async delete(@Body() body: {nameId: string}) {
        return await this.techFindAndDeleteRepo.findAndDelete(body.nameId)
    }

    @Get()
    @PublicRoute()
    async readAll() {
        return await this.techReadService.readAllC();
        
    }

    @ApiBearerAuth("access-token")
    @Post("/:type") // can be /all or /json or /md
    async actualizarGithub(@Param("type")type: string){
        if(!Object.values(ActualizarGithubType).includes(type))throw new InputParseError("Invalid route")
        return await this.techOctokitActualizarGithubRepo.actualizar({type:ActualizarGithubType[type]})
    }
    
    @ApiErrorResponse("auto") //should test
    @ApiBearerAuth("access-token")
    @Put()
    async update(@Body() tech: TechFormDto) {
        return await this.techOctokitUpdateRepo.update(tech)
    }

    @ApiErrorResponse(ErrorCodes.INPUT_PARSE , ErrorCodes.DATABASE_FIND)
    @ApiBearerAuth("access-token")
    @Post()
    async create(@Body() tech: TechFormDto) {
        return await this.techOctokitCreateRepo.create(tech)
    }
}