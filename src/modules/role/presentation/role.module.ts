import { Module } from "@nestjs/common";
import { MongooseRoleRepo } from "../infrastructure/role.repo";
import { RoleCreateUseCase, RoleDeleteByIdUseCase, RoleDeleteUseCase, RoleReadByIdUseCase, RoleReadUseCase, RoleUpdateByIdUseCase,  } from "../application/role.usecase";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleSchemaFactory } from "../infrastructure/role.schema";
import { ROLE_REPOSITORY } from "src/modules/tokens";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Role", schema: RoleSchemaFactory}
        ])
    ],
    controllers: [],
    providers: [
        {
            provide: ROLE_REPOSITORY,
            useClass: MongooseRoleRepo
        },
        RoleCreateUseCase,
        RoleReadByIdUseCase,
        RoleReadUseCase,
        RoleUpdateByIdUseCase,
        RoleDeleteByIdUseCase,
        RoleDeleteUseCase,
    ],
    exports: [RoleCreateUseCase, 
        RoleDeleteByIdUseCase

    ]
})
export class RoleModule {
}