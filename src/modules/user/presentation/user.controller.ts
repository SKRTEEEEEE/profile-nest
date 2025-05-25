import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserReadByIdUseCase, UserReadUseCase, UserUpdateByIdUseCase, UserVerifyEmailUseCase } from "../application/user.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { UserThirdWebCreateUseCase } from "../application/user-thirdweb.usecase";
import { UserNodemailerUpdateUseCase, UserUpdateNodemailer } from "../application/user-nodemailer.usecase";
import { RoleType } from "src/domain/entities/role.type";
import { UserInterface } from "../application/user.interface";
import { UserRoleThirdWebDeleteProps, UserRoleThirdWebDeleteUseCase, UserRoleThirdWebGiveRoleProps, UserRoleThirdwebGiveRoleUseCase } from "../application/user-role-thirdweb.usecase";


@Controller("/user")
export class UserController {
    constructor(
        private readonly userReadByIdService: UserReadByIdUseCase<MongooseBase>,
        private readonly userReadService: UserReadUseCase<MongooseBase>,
        private readonly userThirdWebCreateService: UserThirdWebCreateUseCase<MongooseBase>,
        private readonly userNodemailerUpdateService: UserNodemailerUpdateUseCase<MongooseBase>,
        private readonly userUpdateByIdService: UserUpdateByIdUseCase<MongooseBase>,
        private readonly userRoleThirdWebDeleteService: UserRoleThirdWebDeleteUseCase<MongooseBase>,
        private readonly userRoleThirdwebGiveRoleService: UserRoleThirdwebGiveRoleUseCase<MongooseBase>, 
        private readonly userVerifyEmailService: UserVerifyEmailUseCase<MongooseBase>
    ){}
    @Post()
    @PublicRoute()
    async login(@Body() json: {payload: VerifyLoginPayloadParams}) {
        return this.userThirdWebCreateService.create(json.payload)
    }
    @Put()
    async update(@Body() json: UserUpdateNodemailer<MongooseBase>) {
        return this.userNodemailerUpdateService.update(json)
    }
    //should be tested
    @Delete("/:id")
    async delete(@Param()id: string,@Body() json: UserRoleThirdWebDeleteProps) {
        console.log("json", json)
        return this.userRoleThirdWebDeleteService.deleteById(json)
    }
    @Put("/role")
    async giveRole(@Body() json: UserRoleThirdWebGiveRoleProps<MongooseBase>) {
        return this.userRoleThirdwebGiveRoleService.giveRole(json)
    }
    @Post("/verify-email")
    async verifyEmail(@Body() json: {id: string, verifyToken: string}) {
        return this.userVerifyEmailService.verifyEmail(json)
    }

    @Get("/:id")
    @PublicRoute()
    async readById(@Param() json: {id: string}) {
        return this.userReadByIdService.readById(json.id)
    }
    @Get()
    @PublicRoute()
    async readAll(){
        return this.userReadService.read({})
    }

    @Put("/solicitud")
    async updateSolicitud(@Body() json: {id: string, solicitud: RoleType}) {
        return this.userUpdateByIdService.updateById({id:json.id, updateData:{solicitud:json.solicitud}})
    }
}