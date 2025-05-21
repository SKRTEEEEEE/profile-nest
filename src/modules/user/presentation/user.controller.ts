import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { UserReadUseCase } from "../application/user.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { UserThirdWebCreateUseCase } from "../application/user-thirdweb.usecase";
import { UserNodemailerUpdateUseCase, UserUpdateNodemailer } from "../application/user-nodemailer.usecase";


@Controller("/user")
export class UserController {
    constructor(
        private readonly userReadService: UserReadUseCase<MongooseBase>,
        private readonly userThirdWebCreateService: UserThirdWebCreateUseCase<MongooseBase>,
        private readonly userNodemailerUpdateService: UserNodemailerUpdateUseCase<MongooseBase>
    ){}
    @Get()
    @PublicRoute()
    async readAll(){
        return this.userReadService.read()
    }
    @Post()
    @PublicRoute()
    async create(@Body() json: {payload: VerifyLoginPayloadParams}) {
        return this.userThirdWebCreateService.create(json.payload)
    }
    @Put()
    async update(@Body() json: UserUpdateNodemailer<MongooseBase>) {
        console.log("json in update ", json)
        return this.userNodemailerUpdateService.update(json)
    }
}