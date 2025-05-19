import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { TechForm } from "src/domain/entities/tech";
import { TechReadUseCase } from "../application/tech-read.usecase";
import { TechDeleteUseCase, TechReadByIdUseCase, TechUpdateByIdUseCase, TechUpdateUseCase } from "../application/tech.usecase";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { TechOctokitCreateRepo } from "src/modules/tech/infrastructure/tech-octokit/create.repo";
import { ActualizarGithubTechsType, TechOctokitActualizarGithubRepo } from "../infrastructure/tech-octokit/actualizar.repo";
import { InputParseError } from "src/domain/flows/domain.error";
import { TechOctokitUpdateRepo } from "../infrastructure/tech-octokit/update.repo";
import { TechFindDeleteRepo } from "../infrastructure/delete.repo";

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

    @Delete()
    @PublicRoute()
    async delete(@Body() body: {nameId: string}) {
        return await this.techFindAndDeleteRepo.findAndDelete(body.nameId)
    }

    @Get("/all")
    @PublicRoute()
    async readAll() {
        const res =  await this.techReadService.readAllC();
        return res.flattenTechs
    }

    @Post("/:type")
    @PublicRoute()
    async actualizarGithub(@Param("type")type: string){
        if(!Object.values(ActualizarGithubTechsType).includes(type))throw new InputParseError("Invalid route")
        return await this.techOctokitActualizarGithubRepo.actualizar({type:ActualizarGithubTechsType[type]})
    }

    @Put()
    async update(@Body() tech: TechForm) {
        return await this.techOctokitUpdateRepo.update(tech)
    }

    @Post()
    @PublicRoute()
    async create(@Body() tech: TechForm) {
        return await this.techOctokitCreateRepo.create(tech)
    }
}