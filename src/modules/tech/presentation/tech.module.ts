import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TechController } from "./tech.controller";
import { CRRUUDRepository } from "src/shareds/pattern/application/usecases/crruud.interface";
import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import { TechReadUseCase } from "../application/tech-read.usecase";
import { LengSchemaFactory } from "../infrastructure/tech.schema";
import { MongooseTechRepo } from "../infrastructure/tech.repo";
import { OctokitModule } from "src/shareds/octokit/presentation/octokit.module";
import { TechOctokitCreateRepo } from "../infrastructure/tech-octokit/create.repo";
import { TechCreateUseCase, TechDeleteUseCase, TechReadOneUseCase, TechUpdateUseCase } from "../application/tech.usecase";
import { TechOctokitActualizarGithubRepo } from "../infrastructure/tech-octokit/actualizar.repo";
import { TechOctokitUpdateRepo } from "../infrastructure/tech-octokit/update.repo";
import { TechFindDeleteRepo } from "../infrastructure/delete.repo";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Lenguaje", schema: LengSchemaFactory },
        ]),
        OctokitModule
    ],
    controllers: [TechController],
    providers: [
        {
            provide: CRRUUDRepository, // Registra la interfaz CRRUUDRepository
            useClass: MongooseTechRepo, // Usa MongooseTechRepo como implementación
        },
        // {
        //     provide: ReadOneRepository,
        //     useClass: MongooseTechRepo
        // },
        {
            provide: "TechRepository",
            useClass: MongooseTechRepo
        },
        TechOctokitUpdateRepo, // nuevo
        TechOctokitActualizarGithubRepo,
        TechOctokitCreateRepo,
        TechCreateUseCase, // 
        TechFindDeleteRepo,
        TechReadUseCase, //
        // TechReadByIdUseCase, 
        TechUpdateUseCase, 
        // TechUpdateByIdUseCase, 
        TechDeleteUseCase,
        // TechReadOneUseCase // cambio por ->
        {
            provide: TechReadOneUseCase,
            useFactory: (repo) => new TechReadOneUseCase(repo),
            inject: ["TechRepository"]
        }
        // RoleAuthUseCase, // RoleAuthUseCase ya está registrado
    ],
    // exports: [
        //Aquí he de exportar los servicios que se usen en otros modules(como projects, etc...)
    // ]
})
export class TechModule {}
