import { Module } from "@nestjs/common";
import { CRRUDDRepository } from "src/shareds/pattern/application/usecases/crrudd.interface";
import { MongooseRoleRepo } from "../infrastructure/role.repo";
import { RoleCreateUseCase, RoleDeleteByIdUseCase, RoleDeleteUseCase, RoleReadByIdUseCase, RoleReadUseCase, RoleUpdateByIdUseCase } from "../application/role.usecase";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleSchemaFactory } from "../infrastructure/role.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Role", schema: RoleSchemaFactory}
        ])
    ],
    controllers: [],
    providers: [
        {
            provide: CRRUDDRepository,
            useClass: MongooseRoleRepo
        },
        RoleCreateUseCase,
        // RoleReadByIdUseCase,
        // RoleReadUseCase,
        // RoleUpdateByIdUseCase,
        RoleDeleteByIdUseCase,
        // RoleDeleteUseCase,
    ],
    exports: [RoleCreateUseCase, 
        RoleDeleteByIdUseCase

    ]
})
export class RoleModule {
}