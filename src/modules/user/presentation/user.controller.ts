import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
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
import { UserDto, UserLoginMockDto, UserUpdateDto,  UserManageRoleDto, UserUpdateSolicitudDto, UserVerifyEmailDto } from "./user.dto";
import { AuthThirdWebVerifyPayloadDto } from "src/shareds/thirdweb/auth-thirdweb.dto";
import { UserNodemailerUpdateUseCase } from "../application/user-nodemailer.usecase";
import { Request } from "express";
import { SignatureAuthModule } from "src/shareds/signature-auth/presentation/signature-auth.module";
import { SignatureAuthThirdWebGuard } from "src/shareds/signature-auth/presentation/signature-auth-thirdweb.guard";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { JwtAuthPayload } from "src/shareds/jwt-auth/application/jwt-auth.interface";
import { ApiSignAuthHeader } from "src/shareds/signature-auth/presentation/api-sign-auth.decorator";
import { ApiMockLoginBody } from "./user.decorator";
import { ApiErrorResponse } from "src/shareds/presentation/api-error.decorator";
import { ApiSuccessResponse } from "src/shareds/presentation/api-success.decorator";
import { ResCodes } from "src/domain/flows/res.type";

enum ManageRoleParam {
    Give="give",
    Request="request"
}
@Controller("/user")
@ApiTags("User")
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
    @ApiMockLoginBody(UserLoginMockDto)
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto,ResCodes.ENTITY_CREATED)
    @ApiOperation({
        summary: "🆕 Create - Login user",
        description: `Login a user in the app.

- 🌐 **Public endpoint**: No authentication required.
- ➕ **Operation**: Generate required info with your unique address and create a new user if required or return the existing user.
- 📝 **Request body**: \`User Mock Login\`. **Only if you are in [JWT_STRATEGY -> mock]**. Other case, managed auto with the signed user payload (web3-wallet).
- ✅ **Response**: Returns the user in the database.

Use this endpoint to initialize the app user.`
    })
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
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto,ResCodes.ENTITY_UPDATED)
    @ApiOperation({
        summary: `♻️ Update - Edit user info`,
        description: `Update the actual information of a user.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- ➕ **Operation**: Update a user and if set a new email send a message.
- 📝 **Request body**: \`User Update\`, send the required data.
- 📦 **Response**: Return the info of the updated user 

Useful for update info of the users.`
    })
    async update(@Body() json: UserUpdateDto) {
        return this.userNodemailerUpdateService.update(json)
    } 
    
    //🧠⁉️
    @Delete()
    // @UseGuards(SignatureAuthThirdWebGuard)
    // @ApiSignAuthHeader()// En el futuro se puede hacer incluso un hibrido, mock-addressBody and next-verifiedPayload --> Como en login() - Actualmente sin verifyPayload en backend(solo next)
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto,ResCodes.ENTITY_DELETED)
    @ApiOperation({
    summary: "🗑️ Delete - Remove user from the system",
    description: `Deletes a user and all its associated data.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- ➕ **Operation**: Delete user and associated data, only can be called by the owner provided by Jwt.
- ✅ **Response**: Returns the deleted user object, including its database metadata (id, createdAt, updatedAt).

Use this endpoint to permanently remove your user and her data from the system.`
})
    async delete(@Req() {jwtUser}: {jwtUser: JwtAuthPayload}) {
        // const v = await this.authThirdWebRepository.verifyPayload(json.payload)
        // if (!v.valid) throw new UnauthorizedError("Error with payload auth")
        // if (jwtUser.sub !== address) throw new UnauthorizedError(UserController,"User only can delete her address")

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
    @Patch("/:type")
    // @UseGuards(SignatureAuthThirdWebGuard) //Same as delete(), can be hybrid but rn no verifyPayload    
    // @ApiHeader({
    //     name: 'x-signed-payload',
    //     description: 'Payload firmado por el usuario (JSON stringificado)',
    //     required: true,
    //     schema: { type: 'string' }
    // })
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto,ResCodes.ENTITY_UPDATED)
    @ApiParam({name:"type", enum: ManageRoleParam})
    @ApiOperation({
        summary: `♻️ Update - Give or Request Role`,
        description: `Update (only admin) or Request a Role of a User.

- 🛡️ **Protected endpoint**: Requires a valid access token and be administrator for 'give type'.
- 🗝️ **Parameter**: \`type\` (string) 
    - Give: Update info with a new user role or update the existing if it have
    - Request: Update info with a new user role request
- 📝 **Request body**: \`User Manage Role\`, send the required data.
- 📦 **Response**: The Updated User data, included database metadata like id, createdAt and UpdatedAt.

Useful for manage specials flow of the app.`
    })
    
    async manageRole(@Param("type") type:ManageRoleParam,@Body() props: UserManageRoleDto, @Req() {jwtUser}: {jwtUser: JwtAuthPayload}) {
        if(type === "give"){
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
        }else if(type === "request"){
            return this.userUpdateByIdService.updateById({ id: props.id, updateData: { solicitud: props.solicitud } })
        }
    }
    // @Put("/solicitud")
    // async updateSolicitud(@Body() json: UserUpdateSolicitudDto) {
    //     return this.userUpdateByIdService.updateById({ id: json.id, updateData: { solicitud: json.solicitud } })
    // }



    @Get("/:id")
    @PublicRoute()
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto,ResCodes.ENTITY_FOUND)
    @ApiOperation({
        summary: `📖 Read - By ID`,
        description: `Returns a user data if available.

- 🌐 **Public endpoint**: No authentication required.
- 🗝️ **Parameter**: \`ID\` (string) — Unique identifier for the user.
- 📦 **Response**: Returns the searched user if exist.

Useful for read data or searching existence of user in the application.`
    })
    async readById(@Param() json: { id: string }) {
        return this.userReadByIdService.readById(json.id)
    }
    // @ApiBearerAuth("access-token")
    @Get()
    @PublicRoute()
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto, ResCodes.ENTITIES_FOUND, true) //Hay que mostrar lo que devuelve
    @ApiOperation({
        summary: `📖 Read - All`,
        description: `Returns a list of the users registered to the application.

- 🌐 **Public endpoint**: No authentication required.
- 📦 **Response**: A group (array) of all user registered, included her database metadata.

Useful for listing all users in the application.`
        })
    // @PublicRoute()
    async readAll() {
        return this.userReadService.read({})
    }
    @Patch("/verify-email")
    @ApiBearerAuth("access-token")
    @ApiErrorResponse("auto")
    @ApiSuccessResponse(UserDto,ResCodes.ENTITIES_FOUND)
    @ApiOperation({
        summary: `♻️ Update - Verify Email (by Query)`,
        description: `Returns a list of available technologies filtered by query parameters such as nameId and nameBadge.
    
- 🛡️ **Protected endpoint**: Requires a valid access token.
- 🔎 **Query parameters**:  \`token\` (string) — Token that verify the correct verification of the email.
- 📦 **Response**: Returns the updated user information.

Used for verify the user Email associated to the account.`
        })
    async verifyEmail(@Query() {token}: UserVerifyEmailDto, @Req() req: { user: JwtAuthPayload }) {
        const id = req.user?.ctx?.id!;
        return this.userVerifyEmailService.verifyEmail({ id, verifyToken:token });
    }

}