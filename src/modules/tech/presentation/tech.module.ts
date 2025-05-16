import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TechController } from "./tech.controller";
import { CRRUUDRepository } from "src/shareds/pattern/application/usecases/crruud.interface";
import { RoleAuthUseCase } from "src/shareds/role-auth/application/role-auth.usecase";
import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import { TechReadUseCase } from "../application/tech-read.usecase";
import { LengSchemaFactory } from "../infrastructure/tech.schema";
import { MongooseTechRepo } from "../infrastructure/tech.repo";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Lenguaje", schema: LengSchemaFactory },
        ]),
    ],
    controllers: [TechController],
    providers: [
        {
            provide: CRRUUDRepository, // Registra la interfaz CRRUUDRepository
            useClass: MongooseTechRepo, // Usa MongooseTechRepo como implementación
        },
        {
            provide: ReadOneRepository,
            useClass: MongooseTechRepo
        },
        // TechCreateUseCase, // Nuevo servicio para crear
        TechReadUseCase, // Nuevo servicio para leer
        // TechReadByIdUseCase, // Nuevo servicio para leer por ID
        // TechUpdateUseCase, // Nuevo servicio para actualizar
        // TechUpdateByIdUseCase, // Nuevo servicio para actualizar por ID
        // TechDeleteUseCase,
        // TechReadOneUseCase
        // RoleAuthUseCase, // RoleAuthUseCase ya está registrado
    ],
    // exports: [
        //Aquí he de exportar los servicios que se usen en shared!?
    // ]
})
export class TechModule {}
// @Module({
//     imports: [
//         MongooseModule.forFeature([
//             { name: "Lenguaje", schema: LengSchemaFactory },
//         ]),
//     ],
//     controllers: [TechController],
//     providers: [
//         {
//             provide: TechCrruudService, // Servicio
//             useFactory: (repo: MongooseTechRepo) => {
//                 return new TechCrruudService(repo); // Creación manual del servicio
//             },
//             inject: [MongooseTechRepo], // Inyección del repositorio
//         },
//         MongooseTechRepo, // Registro directo del repositorio
//         RoleAuthUseCase, // Otros servicios necesarios
//     ],
// })
// export class TechModule {}