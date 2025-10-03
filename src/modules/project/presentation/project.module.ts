import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchemaFactory } from "../infrastructure/project.schema";
import { PROJECT_REPOSITORY } from "src/modules/tokens";
import { MongooseProjectRepo } from "../infrastructure/project.repo";
import { ProjectPopulateUseCase, ProjectReadEjemploUseCase } from "../application/project.usecase";
import { ProjectController } from "./project.controller";


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: "Project", schema: ProjectSchemaFactory}
        ])
    ],
    controllers: [ProjectController],
    providers: [
        {
            provide: PROJECT_REPOSITORY,
            useClass: MongooseProjectRepo
        },
        ProjectPopulateUseCase,
        ProjectReadEjemploUseCase
    ]
})
export class ProjectModule {}