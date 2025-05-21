import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchemaFactory } from "../infrastructure/user.schema";
import { CRRUUDIdRepository } from "src/shareds/pattern/application/usecases/crruud-id.interface";
import { MongooseUserRepo } from "../infrastructure/user.repo";
import {  UserCreateUseCase, UserDeleteByIdUseCase, UserReadByIdUseCase, UserReadOneUseCase, UserReadUseCase, UserUpdateByIdUseCase, UserUpdateUseCase } from "../application/user.usecase";
import { UserController } from "./user.controller";
import { UserThirdWebCreateUseCase } from "../application/user-thirdweb.usecase";
import { ThirdWebModule } from "src/shareds/thirdweb/thirdweb.module";
import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import { NodemailerModule } from "src/shareds/nodemailer/nodemailer.module";
import { UserNodemailerUpdateUseCase } from "../application/user-nodemailer.usecase";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: "User", schema: UserSchemaFactory},
    ]),
    ThirdWebModule,
    NodemailerModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        {
            provide: CRRUUDIdRepository,
            useClass: MongooseUserRepo,
        },
        {
            provide: ReadOneRepository,
            useClass: MongooseUserRepo
        },
        UserNodemailerUpdateUseCase,
        UserCreateUseCase,
        UserThirdWebCreateUseCase,
        UserReadOneUseCase,
        UserReadUseCase,
        UserReadByIdUseCase,
        // UserUpdateUseCase,
        UserUpdateByIdUseCase,
        // UserDeleteByIdUseCase,
    ]
})
export class UserModule{}