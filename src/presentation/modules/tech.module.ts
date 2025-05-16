import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseTechRepo } from "src/infrastructure/mongoose/entities/tech.repo";
import { TechController } from "../controllers/tech.controller";
import { CRRUUDRepository } from "src/application/interfaces/patterns/crruud.interface";
import { RoleAuthService } from "src/application/usecases/shareds/role-auth.service";
import { LengSchemaFactory } from "src/infrastructure/mongoose/schemas/tech.schema";
import { TechCreateService, TechDeleteService, TechReadByIdService, TechReadOneService, TechReadService, TechUpdateByIdService, TechUpdateService } from "src/application/usecases/entities/tech.service";
import { ReadOneRepository } from "src/application/interfaces/patterns/read-one.interface";

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
        TechCreateService, // Nuevo servicio para crear
        TechReadService, // Nuevo servicio para leer
        TechReadByIdService, // Nuevo servicio para leer por ID
        TechUpdateService, // Nuevo servicio para actualizar
        TechUpdateByIdService, // Nuevo servicio para actualizar por ID
        TechDeleteService,
        TechReadOneService
        // RoleAuthService, // RoleAuthService ya está registrado
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
//         RoleAuthService, // Otros servicios necesarios
//     ],
// })
// export class TechModule {}