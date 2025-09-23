import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchemaFactory } from "../infrastructure/user.schema";
import { MongooseUserRepo } from "../infrastructure/user.repo";
import {  UserCreateUseCase, UserDeleteByIdUseCase, UserReadByIdUseCase, UserReadOneUseCase, UserReadUseCase, UserUpdateByIdUseCase,  UserVerifyEmailUseCase } from "../application/user.usecase";
import { UserController } from "./user.controller";
// import { UserThirdWebLoginUseCase } from "../application/user-thirdweb.usecase";
import { ThirdWebModule } from "src/shareds/thirdweb/thirdweb.module";
import { NodemailerModule } from "src/shareds/nodemailer/nodemailer.module";
// import { UserRoleThirdWebDeleteUseCase, UserRoleThirdwebGiveRoleUseCase } from "../application/user-role-thirdweb.usecase";
import { RoleModule } from "src/modules/role/presentation/role.module";
import { UserNodemailerUpdateUseCase } from "../application/user-nodemailer.usecase";
import { SignatureAuthModule } from "src/shareds/signature-auth/presentation/signature-auth.module";
import { USER_REPOSITORY } from "src/modules/tokens";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: "User", schema: UserSchemaFactory},
    ]),
    ThirdWebModule,
    NodemailerModule,
    RoleModule,
    SignatureAuthModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: MongooseUserRepo
        },
        // {
        //     provide: CRRUUDIdRepository,
        //     useClass: MongooseUserRepo,
        // },
        // {
        //     provide: ReadOneRepository,
        //     useClass: MongooseUserRepo
        // },
        // UserRoleThirdWebDeleteUseCase,
        // UserRoleThirdwebGiveRoleUseCase,
        UserNodemailerUpdateUseCase,
        // UserThirdWebLoginUseCase,
        UserCreateUseCase,
        UserReadOneUseCase,
        UserReadUseCase,
        UserReadByIdUseCase,
        // UserUpdateUseCase,
        UserUpdateByIdUseCase,
        UserDeleteByIdUseCase,
        UserVerifyEmailUseCase,
    ]
})
export class UserModule{}