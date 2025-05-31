import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserCreateUseCase, UserDeleteByIdUseCase, UserReadByIdUseCase, UserReadOneUseCase, UserReadUseCase, UserUpdateByIdUseCase, UserVerifyEmailUseCase } from "../application/user.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
// import { UserThirdWebLoginUseCase } from "../application/user-thirdweb.usecase";
// import { UserNodemailerUpdateUseCase, UserUpdateNodemailer } from "../application/user-nodemailer.usecase";
import { RoleType } from "src/domain/entities/role.type";
// import { UserRoleThirdWebDeleteProps, UserRoleThirdWebDeleteUseCase, UserRoleThirdWebGiveRoleProps, UserRoleThirdwebGiveRoleUseCase } from "../application/user-role-thirdweb.usecase";
import { AuthThirdWebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";
import { DatabaseFindError, InputParseError, UnauthorizedError } from "src/domain/flows/domain.error";
import { RoleCreateUseCase, RoleDeleteByIdUseCase } from "src/modules/role/application/role.usecase";
import { UserMockLoginDto, UserNodemailerUpdateDto,  UserRoleThirdWebGiveRoleDto, UserUpdateSolicitudDto, UserVerifyEmailDto } from "./user.dto";
import { AuthThirdWebVerifyPayloadDto } from "src/shareds/thirdweb/auth-thirdweb.dto";
import { UserNodemailerUpdateUseCase } from "../application/user-nodemailer.usecase";
import { Request } from "express";
import { SignatureAuthModule } from "src/shareds/signature-auth/presentation/signature-auth.module";
import { SignatureAuthThirdWebGuard } from "src/shareds/signature-auth/presentation/signature-auth-thirdweb.guard";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { JwtAuthPayload } from "src/shareds/jwt-auth/application/jwt-auth.interface";
import { ApiSignAuthHeader } from "src/shareds/signature-auth/presentation/api-sign-auth.decorator";
import { ApiMockLoginBody } from "./user.decorator";


@Controller("/user")
export class UserController {
    constructor(
        private readonly userReadByIdService: UserReadByIdUseCase<MongooseBase>,
        private readonly userReadService: UserReadUseCase<MongooseBase>,
        private readonly userUpdateByIdService: UserUpdateByIdUseCase<MongooseBase>,
        private readonly userVerifyEmailService: UserVerifyEmailUseCase<MongooseBase>,
        private readonly userNodemailerUpdateService: UserNodemailerUpdateUseCase<MongooseBase>, // 🧠 -> No es necesario 'crear' este tipo de UseCase (varios module -user, tech, etc..- con dif use cases) -> Podemos montar dicha endpoint aquí, evitando tener capa app 
        // use Repo here!!
        // private readonly authThirdWebRepository: AuthThirdWebRepo,
        private readonly userCreateService: UserCreateUseCase<MongooseBase>,
        private readonly userReadOneService: UserReadOneUseCase<MongooseBase>,
        // private readonly userThirdWebCreateService: UserThirdWebLoginUseCase<MongooseBase>,
        private readonly roleDeleteByIdService: RoleDeleteByIdUseCase<MongooseBase>,
        private readonly userDeleteByIdService: UserDeleteByIdUseCase<MongooseBase>,
        // private readonly userRoleThirdWebDeleteService: UserRoleThirdWebDeleteUseCase<MongooseBase>,
        private readonly roleCreateService: RoleCreateUseCase<MongooseBase>,
        // private readonly userRoleThirdwebGiveRoleService: UserRoleThirdwebGiveRoleUseCase<MongooseBase>, 
    ) { }

    @Post()
    @PublicRoute()
    @UseGuards(SignatureAuthThirdWebGuard)
    @ApiMockLoginBody(UserMockLoginDto)
    async login(@Req(){verifiedPayload},@Body() body: any) 
    {
        let address: string | undefined;

    if (process.env.JWT_STRATEGY === "mock") {
        // En mock, permite pasar el address por body
        address = body.address;
        if (!address) throw new UnauthorizedError(UserController, "Address is required in mock mode");
    } else {
        // En real, usa el address de la firma verificada
   
        if (!verifiedPayload?.valid) throw new UnauthorizedError(UserController, "Payload not valid");
        address = verifiedPayload.payload.address;
    }
    if(!address) throw new InputParseError(UserController)
    let user = await this.userReadOneService.readByAddress(address);
    if (!user) {
        user = await this.userCreateService.create({
            address,
            roleId: null, role: null, solicitud: null, img: null, email: null, isVerified: false, nick: null
        });
    }
    return user;
    }

    @Put()
    async update(@Body() json: UserNodemailerUpdateDto) {
        return this.userNodemailerUpdateService.update(json)
    } 
    
    //🚧⚠️⁉️
    //should be tested (Delete)
    // @ApiHeader({
    //     name: 'x-signed-payload',
    //     description: 'Payload firmado por el usuario (JSON stringificado)',
    //     required: true,
    //     schema: { type: 'string' }
    // })
    @ApiSignAuthHeader()
    @UseGuards(SignatureAuthThirdWebGuard)
    @Delete("/:id")
    async delete(@Param() address: string, @Req() {jwtUser}: {jwtUser: JwtAuthPayload}) {
        // const v = await this.authThirdWebRepository.verifyPayload(json.payload)
        // if (!v.valid) throw new UnauthorizedError("Error with payload auth")
        if (jwtUser.sub !== address) throw new UnauthorizedError(UserController,"User only can delete her address")

        const userId = jwtUser.ctx?.id;
        // console.log("userId in delete user: ", userId)
        // deleteUser(id)
        if(!userId)throw new UnauthorizedError(UserController,"Error with user jwt, id doesn't exist")
        const user = await this.userReadByIdService.readById(userId)
        if (!user) throw new DatabaseFindError("readById",UserController,{ optionalMessage: "User not found" })
        if (user.roleId !== null) {
            await this.roleDeleteByIdService.deleteById(user.roleId as DeleteByIdProps<MongooseBase>);
        }
        await this.userDeleteByIdService.deleteById(userId)
    }
    @ApiHeader({
        name: 'x-signed-payload',
        description: 'Payload firmado por el usuario (JSON stringificado)',
        required: true,
        schema: { type: 'string' }
    })
    @UseGuards(SignatureAuthThirdWebGuard)
    @Put("/role")
    async giveRole(@Body() props: UserRoleThirdWebGiveRoleDto, @Req() {jwtUser}: {jwtUser: JwtAuthPayload}) {
        // const signUser = await this.userReadOneService.readByAddress(req.verifiedPayload.payload.payload.address)
        const signUser = await this.userReadOneService.readByAddress(jwtUser.sub)
        if (!signUser) throw new DatabaseFindError("readByAddress",UserController,{ optionalMessage: "signer user not found" })
        if (signUser.role !== "ADMIN") throw new UnauthorizedError(UserController,"Only admins")
        const user = await this.userReadByIdService.readById(props.id)
        if (!user) throw new DatabaseFindError("readById",UserController,{ entity: "user", optionalMessage: "User not found for give role" })
        const createdRole = await this.roleCreateService.create({address: user.address, permissions:props.solicitud})
        // const createdRole = await this.roleCreateService.create({ address: req.verifiedPayload.payload.payload.address, permissions: props.solicitud })
        return await this.userUpdateByIdService.updateById({
            id: props.id, updateData: {
                address: user.address, roleId: createdRole.id,
                role: props.solicitud, solicitud: null, img: user.img, email: user.email, isVerified: user.isVerified
            }
        })
    }
    @Post("/verify-email")
    async verifyEmail(@Body() {verifyToken}: UserVerifyEmailDto, @Req() req: { user: JwtAuthPayload }) {
        const id = req.user?.ctx?.id!;
        return this.userVerifyEmailService.verifyEmail({ id, verifyToken });
    }

    @Get("/:id")
    @PublicRoute()
    async readById(@Param() json: { id: string }) {
        return this.userReadByIdService.readById(json.id)
    }
    // @ApiBearerAuth("access-token")
    @Get()
    @PublicRoute()
    // @PublicRoute()
    async readAll() {
        return this.userReadService.read({})
    }

    @Put("/solicitud")
    async updateSolicitud(@Body() json: UserUpdateSolicitudDto) {
        return this.userUpdateByIdService.updateById({ id: json.id, updateData: { solicitud: json.solicitud } })
    }
}