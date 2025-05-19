import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserReadUseCase } from "../application/user.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { UserThirdWebCreateUseCase } from "../application/user-thirdweb.usecase";


@Controller("/user")
export class UserController {
    constructor(
        private readonly userReadService: UserReadUseCase<MongooseBase>,
        private readonly userThirdWebCreateService: UserThirdWebCreateUseCase<MongooseBase>
    ){}

    @Get()
    @PublicRoute()
    async readAll(){
        return this.userReadService.read()
    }

    @Post()
    @PublicRoute()
    async create(@Body() json: {payload: VerifyLoginPayloadParams}) {
        console.log("payload: ",json.payload)
        return this.userThirdWebCreateService.create(json.payload)
    }
}