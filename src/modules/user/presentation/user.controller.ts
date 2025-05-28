import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserCreateUseCase, UserDeleteByIdUseCase, UserReadByIdUseCase, UserReadOneUseCase, UserReadUseCase, UserUpdateByIdUseCase, UserVerifyEmailUseCase } from "../application/user.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
// import { UserThirdWebLoginUseCase } from "../application/user-thirdweb.usecase";
// import { UserNodemailerUpdateUseCase, UserUpdateNodemailer } from "../application/user-nodemailer.usecase";
import { RoleType } from "src/domain/entities/role.type";
// import { UserRoleThirdWebDeleteProps, UserRoleThirdWebDeleteUseCase, UserRoleThirdWebGiveRoleProps, UserRoleThirdwebGiveRoleUseCase } from "../application/user-role-thirdweb.usecase";
import { AuthThirdwebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";
import { DatabaseFindError, UnauthorizedError } from "src/domain/flows/domain.error";
import { RoleCreateUseCase, RoleDeleteByIdUseCase } from "src/modules/role/application/role.usecase";
import { UserNodemailerUpdateDto, UserRoleThirdWebDeleteDto, UserRoleThirdWebGiveRoleDto, UserUpdateSolicitudDto, UserVerifyEmailDto } from "./user.dto";
import { AuthThirdWebVerifyPayloadDto } from "src/shareds/thirdweb/auth-thirdweb.dto";
import { UserNodemailerUpdateUseCase } from "../application/user-nodemailer.usecase";


@Controller("/user")
export class UserController {
    constructor(
        private readonly userReadByIdService: UserReadByIdUseCase<MongooseBase>,
        private readonly userReadService: UserReadUseCase<MongooseBase>,
        private readonly userUpdateByIdService: UserUpdateByIdUseCase<MongooseBase>,
        private readonly userVerifyEmailService: UserVerifyEmailUseCase<MongooseBase>,
        private readonly userNodemailerUpdateService: UserNodemailerUpdateUseCase<MongooseBase>, // 🧠 -> No es necesario 'crear' este tipo de UseCase (varios module -user, tech, etc..- con dif use cases) -> Podemos montar dicha endpoint aquí, evitando tener capa app 
        // use Repo here!!
        private readonly authThirdWebRepository: AuthThirdwebRepo,
        private readonly userCreateService: UserCreateUseCase<MongooseBase>,
        private readonly userReadOneService: UserReadOneUseCase<MongooseBase>,
        // private readonly userThirdWebCreateService: UserThirdWebLoginUseCase<MongooseBase>,
        private readonly roleDeleteByIdService: RoleDeleteByIdUseCase<MongooseBase>,
        private readonly userDeleteByIdService: UserDeleteByIdUseCase<MongooseBase>,
        // private readonly userRoleThirdWebDeleteService: UserRoleThirdWebDeleteUseCase<MongooseBase>,
        private readonly roleCreateService: RoleCreateUseCase<MongooseBase>,
        // private readonly userRoleThirdwebGiveRoleService: UserRoleThirdwebGiveRoleUseCase<MongooseBase>, 
    ){}
    @Post()
    @PublicRoute()
    async login(@Body() payload: AuthThirdWebVerifyPayloadDto) {
        const verifiedPayload = await this.authThirdWebRepository.verifyPayload(payload);
        if (!verifiedPayload.valid) throw new UnauthorizedError("Payload not valid")
        let user = await this.userReadOneService.readByAddress(verifiedPayload.payload.address);
        if(!user) return await this.userCreateService.create({ address: verifiedPayload.payload.address as string, roleId: null, role: null, solicitud: null, img: null, email: null , isVerified: false, nick: null});
        return user;
    }
    @Put()
    async update(@Body() json: UserNodemailerUpdateDto) {
        return this.userNodemailerUpdateService.update(json)
    } //🚧⚠️⁉️
    //should be tested
    @Delete("/:id")
    async delete(@Param()id: string,@Body() json: UserRoleThirdWebDeleteDto) {
        const v = await this.authThirdWebRepository.verifyPayload(json.payload)
        if (!v.valid) throw new UnauthorizedError("Error with payload auth")
        if (v.payload.address !== json.address) throw new UnauthorizedError("User only can delete her address")
    
        //deleteUser(id)
        const user = await this.userReadByIdService.readById(json.id)
        if (!user) throw new DatabaseFindError({optionalMessage:"User not found"})
        if (user.roleId !== null) {
        await this.roleDeleteByIdService.deleteById(user.roleId as DeleteByIdProps<MongooseBase>);
        }
        await this.userDeleteByIdService.deleteById(json.id)
    }
    @Put("/role")
    async giveRole(@Body() props: UserRoleThirdWebGiveRoleDto) {
           const v = await this.authThirdWebRepository.verifyPayload(props.payload)
    if (!v.valid) throw new UnauthorizedError("payload auth")
      const signUser = await this.userReadOneService.readByAddress(props.payload.payload.address)
    if (!signUser) throw new DatabaseFindError({optionalMessage:"signer user not found"})
    if (signUser.role!=="ADMIN") throw new UnauthorizedError("Only admins")
        const user = await this.userReadByIdService.readById(props.id)
        if(!user)throw new DatabaseFindError({entitie:"user", optionalMessage: "User not found at give role action"})
    const createdRole = await this.roleCreateService.create({address: props.payload.payload.address,permissions: props.solicitud})
    await this.userUpdateByIdService.updateById({id: props.id, updateData:{
       address: user.address, roleId: createdRole.id,
      role: props.solicitud, solicitud: null, img: user.img, email: user.email, isVerified: user.isVerified
    }})
    }
    @Post("/verify-email")
    async verifyEmail(@Body() json: UserVerifyEmailDto) {
        return this.userVerifyEmailService.verifyEmail(json)
    }

    @Get("/:id")
    @PublicRoute()
    async readById(@Param() json: {id: string}) {
        return this.userReadByIdService.readById(json.id)
    }
    @Get()
    // @PublicRoute()
    async readAll(){
        return this.userReadService.read({})
    }

    @Put("/solicitud")
    async updateSolicitud(@Body() json:UserUpdateSolicitudDto) {
        return this.userUpdateByIdService.updateById({id:json.id, updateData:{solicitud:json.solicitud}})
    }
}