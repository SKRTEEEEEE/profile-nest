import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  UserCreateUseCase,
  UserDeleteByIdUseCase,
  UserReadByIdUseCase,
  UserReadOneUseCase,
  UserReadUseCase,
  UserUpdateByIdUseCase,
  UserVerifyEmailUseCase,
} from '../application/user.usecase';
import { DBBase } from 'src/dynamic.types';;
import { PublicRoute } from 'src/shareds/jwt-auth/presentation/public-route.decorator';
import { RoleType } from 'src/domain/entities/role.type';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import {
  RoleCreateUseCase,
  RoleDeleteByIdUseCase,
} from 'src/modules/role/application/role.usecase';
import {
  UserDto,
  UserLoginMockDto,
  UserUpdateDto,
  UserManageRoleDto,
  UserVerifyEmailDto,
} from './user.dto';
import { UserNodemailerUpdateUseCase } from '../application/user-nodemailer.usecase';
import { SignatureAuthThirdWebGuard } from 'src/shareds/signature-auth/presentation/signature-auth-thirdweb.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthPayload } from 'src/shareds/jwt-auth/application/jwt-auth.interface';
import { ApiMockLoginBody } from './user.decorator';
import { ApiErrorResponse } from 'src/shareds/presentation/api-error.decorator';
import { ApiSuccessResponse } from 'src/shareds/presentation/api-success.decorator';
import { ResCodes } from 'src/domain/flows/res.type';

enum ManageRoleParam {
  Give = 'give',
  Request = 'request',
}
@Controller('/user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userReadByIdService: UserReadByIdUseCase,
    private readonly userReadService: UserReadUseCase,
    private readonly userUpdateByIdService: UserUpdateByIdUseCase,
    private readonly userVerifyEmailService: UserVerifyEmailUseCase,
    private readonly userNodemailerUpdateService: UserNodemailerUpdateUseCase, // 🧠 -> No es necesario 'crear' este tipo de UseCase (varios module -user, tech, etc..- con dif use cases) -> Podemos montar dicha endpoint aquí, evitando tener capa app
    // use Repo here!!
    // private readonly authThirdWebRepository: AuthThirdWebRepo,
    private readonly userCreateService: UserCreateUseCase,
    private readonly userReadOneService: UserReadOneUseCase,
    // private readonly userThirdWebCreateService: UserThirdWebLoginUseCase<DBBase>,
    private readonly roleDeleteByIdService: RoleDeleteByIdUseCase,
    private readonly userDeleteByIdService: UserDeleteByIdUseCase,
    // private readonly userRoleThirdWebDeleteService: UserRoleThirdWebDeleteUseCase<DBBase>,
    private readonly roleCreateService: RoleCreateUseCase,
    // private readonly userRoleThirdwebGiveRoleService: UserRoleThirdwebGiveRoleUseCase<DBBase>,
  ) {}

  @Post()
  @PublicRoute()
  @UseGuards(SignatureAuthThirdWebGuard)
  @ApiMockLoginBody(UserLoginMockDto)
  @ApiErrorResponse('full')
  @ApiSuccessResponse(UserDto, ResCodes.OPERATION_SUCCESS)
  @ApiOperation({
    summary: '🆕 Create - Login user',
    description: `Login a user in the app.

- 🌐 **Public endpoint**: No authentication required.
- ➕ **Operation**: Generate required info with your unique address and create a new user if required or return the existing user.
${process.env.JWT_STRATEGY === 'mock' && '- 📝 **Request body**: `User Mock Login`. '}
- 📄 **Extra head -> (only with) [JWT_STRATEGY -> (default)]**: The payload of the user address signature.
- ✅ **Response**: Returns the user in the database.

Use this endpoint to initialize the app user.`,
  })
  async login(@Req() { verifiedPayload }, @Body() body: any) {
    let address: string | undefined;

    if (process.env.JWT_STRATEGY === 'mock') {
      // En mock, permite pasar el address por body

      address = body.address;
      const password = body.password;
      if (!address)
        throw createDomainError(
          ErrorCodes.INPUT_PARSE,
          UserController,
          'login',
        );
      if (!password)
        throw createDomainError(
          ErrorCodes.INPUT_PARSE,
          UserController,
          'login',
        );
      const rp = process.env[address];
      if (rp !== password)
        throw createDomainError(
          ErrorCodes.UNAUTHORIZED_ACTION,
          UserController,
          'login',
          'credentials',
        );
    } else {
      // En real, usa el address de la firma verificada

      if (!verifiedPayload?.valid)
        throw createDomainError(
          ErrorCodes.UNAUTHORIZED_ACTION,
          UserController,
          'login',
          'd',
          { shortDesc: 'Payload not valid' },
        );
      address = verifiedPayload.payload.address;
    }
    if (!address)
      throw createDomainError(ErrorCodes.INPUT_PARSE, UserController, 'login');
    let user = await this.userReadOneService.readByAddress(address);
    if (!user) {
      if (process.env.JWT_STRATEGY !== 'mock') {
        user = await this.userCreateService.create({
          address,
          roleId: null,
          role: null,
          solicitud: null,
          img: null,
          email: null,
          isVerified: false,
          nick: null,
        });
      } else {
        console.info('Some mock log in', address);
      }
    }
    return user;
  }

  @Put()
  @ApiBearerAuth('access-token')
  // @ApiSignAuthHeader() //🏗️ - 📄 **Extra head**: The payload of the user address signature.
  @ApiErrorResponse('full')
  @ApiSuccessResponse(UserDto, ResCodes.ENTITY_UPDATED)
  @ApiOperation({
    summary: `♻️ Update - Edit user info`,
    description: `Update the actual information of a user.

- 🛡️ **Protected endpoint**: Requires a valid access token and signature limiting this action only to admin or own user.
- ➕ **Operation**: Update a user and if set a new email send a message.
- 📝 **Request body**: \`User Update\`, send the required data.
- 📦 **Response**: Return the info of the updated user 

Useful for update info of the users.`,
  })
  async update(@Body() json: UserUpdateDto) {
    //se ha de comprobar la autoría(head signature)
    return this.userNodemailerUpdateService.update(json);
  }

  //🧠⁉️
  @Delete()
  // @UseGuards(SignatureAuthThirdWebGuard)
  // @ApiSignAuthHeader()// En el futuro se puede hacer incluso un hibrido, mock-addressBody and next-verifiedPayload --> Como en login() - Actualmente sin verifyPayload en backend(solo next)
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('full')
  @ApiSuccessResponse(UserDto, ResCodes.ENTITY_DELETED)
  @ApiOperation({
    summary: '🗑️ Delete - Remove user from the system',
    description: `Deletes a user and all its associated data.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- ➕ **Operation**: Delete user and associated data, only can be called by the owner provided by Jwt.
- ✅ **Response**: Returns the deleted user object, including its database metadata (id, createdAt, updatedAt).

Use this endpoint to permanently remove your user and her data from the system.`,
  })
  async delete(@Req() { jwtUser }: { jwtUser: JwtAuthPayload }) {
    const userId = jwtUser.ctx?.id;
    // deleteUser(id)
    if (!userId)
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        UserController,
        'delete',
        undefined,
        { shortDesc: "Error with user jwt, id doesn't exist" },
      );
    const user = await this.userReadByIdService.readById(userId);
    if (!user)
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        UserController,
        'readById',
        undefined,
        { optionalMessage: 'User not found' },
      );
    if (user.roleId !== null) {
      await this.roleDeleteByIdService.deleteById(
        user.roleId as string,
      );
    }
    await this.userDeleteByIdService.deleteById(userId);
  }
  @Patch('/:type')
  // @UseGuards(SignatureAuthThirdWebGuard) //Same as delete(), can be hybrid but rn no verifyPayload
  // @ApiHeader({
  //     name: 'x-signed-payload',
  //     description: 'Payload firmado por el usuario (JSON stringificado)',
  //     required: true,
  //     schema: { type: 'string' }
  // })
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('full')
  @ApiSuccessResponse(UserDto, ResCodes.ENTITY_UPDATED)
  @ApiParam({ name: 'type', enum: ManageRoleParam })
  @ApiOperation({
    summary: `♻️ Update - Give or Request Role`,
    description: `Update (only admin) or Request a Role of a User.

- 🛡️ **Protected endpoint**: Requires a valid access token and be administrator for 'give type'.
- 🗝️ **Parameter**: \`type\` (string) 
    - Give: Update info with a new user role or update the existing if it have
    - Request: Update info with a new user role request
- 📝 **Request body**: \`User Manage Role\`, send the required data.
- 📦 **Response**: The Updated User data, included database metadata like id, createdAt and UpdatedAt.

Useful for manage specials flow of the app.`,
  })
  async manageRole(
    @Param('type') type: ManageRoleParam,
    @Body() props: UserManageRoleDto,
    @Req() { jwtUser }: { jwtUser: JwtAuthPayload },
  ) {
    if (type === 'give') {
      // const signUser = await this.userReadOneService.readByAddress(req.verifiedPayload.payload.payload.address)
      const signUser = await this.userReadOneService.readByAddress(jwtUser.sub);
      if (!signUser)
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          UserController,
          'readByAddress',
          undefined,
          { optionalMessage: 'signer user not found' },
        );
      if (signUser.role !== 'ADMIN')
        throw createDomainError(
          ErrorCodes.UNAUTHORIZED_ACTION,
          UserController,
          'manageRole',
        );
      const user = await this.userReadByIdService.readById(props.id);
      if (!user)
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          UserController,
          'readById',
          undefined,
          { entity: 'user', optionalMessage: 'User not found for give role' },
        );
      const createdRole = await this.roleCreateService.create({
        address: user.address,
        permissions: props.solicitud,
      });
      // const createdRole = await this.roleCreateService.create({ address: req.verifiedPayload.payload.payload.address, permissions: props.solicitud })
      return await this.userUpdateByIdService.updateById({
        id: props.id,
        updateData: {
          address: user.address,
          roleId: createdRole.id,
          role: props.solicitud,
          solicitud: null,
          img: user.img,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } else if (type === 'request') {
      return this.userUpdateByIdService.updateById({
        id: props.id,
        updateData: { solicitud: props.solicitud },
      });
    }
  }
  // @Put("/solicitud")
  // async updateSolicitud(@Body() json: UserUpdateSolicitudDto) {
  //     return this.userUpdateByIdService.updateById({ id: json.id, updateData: { solicitud: json.solicitud } })
  // }

  @Get('/:id')
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('get', '--protected')
  @ApiSuccessResponse(UserDto, ResCodes.ENTITY_FOUND)
  @ApiOperation({
    summary: `📖 Read - By ID`,
    description: `Returns a user data if available.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- 🗝️ **Parameter**: \`ID\` (string) — Unique identifier for the user.
- 📦 **Response**: Returns the searched user if exist.

Useful for read data or searching existence of user in the application.`,
  })
  async readById(@Param() json: { id: string }) {
    return this.userReadByIdService.readById(json.id);
  }
  @Get()
  // @UseGuards(RoleAuthTokenGuard)
  // @Roles(RoleType.ADMIN) -> en el futuro tener dos tipos, uno para lista básica publica, otra para lista privada con detalles
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('get', '--protected')
  @ApiSuccessResponse(UserDto, ResCodes.ENTITIES_FOUND, true) //Hay que mostrar lo que devuelve
  @ApiOperation({
    summary: `📖 Read - All`,
    description: `Returns a list of the users registered to the application.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- 📦 **Response**: A group (array) of all user registered, included her database metadata.

Useful for listing all users in the application.`,
  })
  async readAll() {
    return this.userReadService.read({});
  }
  @Patch('/verify-email')
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('full')
  @ApiSuccessResponse(UserDto, ResCodes.ENTITIES_FOUND)
  @ApiOperation({
    summary: `♻️ Update - Verify Email (by Query)`,
    description: `Returns a list of available technologies filtered by query parameters such as nameId and nameBadge.
    
- 🛡️ **Protected endpoint**: Requires a valid access token.
- 🔎 **Query parameters**:  \`token\` (string) — Token that verify the correct verification of the email.
- 📦 **Response**: Returns the updated user information.

Used for verify the user Email associated to the account.`,
  })
  async verifyEmail(
    @Query() { token }: UserVerifyEmailDto,
    @Req() req: { user: JwtAuthPayload },
  ) {
    const id = req.user?.ctx?.id;

    if (!id) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION, // O el código que tengas para auth
        this.constructor,
        'verifyEmail',
        {
          es: 'Usuario no autenticado correctamente',
          en: 'User not properly authenticated',
          ca: 'Usuari no autenticat correctament',
          de: 'Benutzer nicht ordnungsgemäß authentifiziert',
        },
        {
          field: 'user.ctx.id',
          reason: 'Missing user ID in JWT context',
        },
        'ups',
      );
    }

    return this.userVerifyEmailService.verifyEmail({ id, verifyToken: token });
  }
}
