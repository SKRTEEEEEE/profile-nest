import { Body, Controller, Get, Post } from "@nestjs/common";

import { TechOctokitCreateService } from "src/application/usecases/shareds/tech-octokit.service";
import { TechForm } from "src/domain/entities/tech";
import { TechReadUseCase } from "../application/tech-read.usecase";
import { TechDeleteUseCase, TechReadByIdUseCase, TechUpdateByIdUseCase, TechUpdateUseCase } from "../application/tech.usecase";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";

@Controller("/tech")
export class TechController {
    constructor(
        // private readonly techCreateService: TechCreateUseCase<MongooseBase>,
        // private readonly techOctokitCreateService: TechOctokitCreateService,
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

    // @Post()
    // @PublicRoute()
    // async update(@Body() tech: TechForm) {
    //     return await this.techOctokitCreateService.create(tech)
    // }
}