import { Body, Controller, Get, Post } from "@nestjs/common";

import { TechForm } from "src/domain/entities/tech";
import { TechReadUseCase } from "../application/tech-read.usecase";
import { TechDeleteUseCase, TechReadByIdUseCase, TechUpdateByIdUseCase, TechUpdateUseCase } from "../application/tech.usecase";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { TechOctokitCreateRepo } from "src/modules/tech/infrastructure/tech-octokit/create.repo";

@Controller("/tech")
export class TechController {
    constructor(
        // private readonly techCreateService: TechCreateUseCase<MongooseBase>,
        private readonly techOctokitCreateRepo: TechOctokitCreateRepo,
        private readonly techReadService: TechReadUseCase<MongooseBase>,
        // private readonly techReadByIdService: TechReadByIdUseCase<MongooseBase>,
        // private readonly techUpdateService: TechUpdateUseCase<MongooseBase>,
        // private readonly techUpdateByIdService: TechUpdateByIdUseCase<MongooseBase>,
        // private readonly techDeleteService: TechDeleteUseCase<MongooseBase>
    ) {}

    @Get("/all")
    @PublicRoute()
    async readAll() {
        return await this.techReadService.read({});
    }

    @Post()
    @PublicRoute()
    async create(@Body() tech: TechForm) {
        return await this.techOctokitCreateRepo.create(tech)
    }
}