import { Body, Controller, Get, Post } from "@nestjs/common";
import { MongooseBase } from "src/infrastructure/mongoose/types";
import { PublicRoute } from "../decorators/public-route.decorator";
import { TechCreateService } from "src/application/usecases/entities/tech.service";
import { TechReadService } from "src/application/usecases/entities/tech.service";
import { TechReadByIdService } from "src/application/usecases/entities/tech.service";
import { TechUpdateService } from "src/application/usecases/entities/tech.service";
import { TechUpdateByIdService } from "src/application/usecases/entities/tech.service";
import { TechDeleteService } from "src/application/usecases/entities/tech.service";
import { Roles } from "../decorators/role.decorator";
import { TechOctokitCreateService } from "src/application/usecases/shareds/tech-octokit.service";
import { TechForm } from "src/domain/entities/tech";

@Controller("/tech")
export class TechController {
    constructor(
        // private readonly techCreateService: TechCreateService<MongooseBase>,
        // private readonly techOctokitCreateService: TechOctokitCreateService,
        private readonly techReadService: TechReadService<MongooseBase>,
        private readonly techReadByIdService: TechReadByIdService<MongooseBase>,
        private readonly techUpdateService: TechUpdateService<MongooseBase>,
        private readonly techUpdateByIdService: TechUpdateByIdService<MongooseBase>,
        private readonly techDeleteService: TechDeleteService<MongooseBase>
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