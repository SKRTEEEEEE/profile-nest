import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TechReadUseCase } from '../application/tech-read.usecase';

import { PublicRoute } from 'src/shareds/jwt-auth/presentation/public-route.decorator';
import { TechOctokitCreateRepo } from 'src/modules/tech/infrastructure/tech-octokit/create.repo';
import {
  ActualizarGithubType,
  TechOctokitActualizarGithubRepo,
} from '../infrastructure/tech-octokit/actualizar.repo';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { TechOctokitUpdateRepo } from '../infrastructure/tech-octokit/update.repo';
import { TechFindDeleteRepo } from '../infrastructure/delete.repo';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  FullTechDataDto,
  LangDto,
  TechDto,
  TechFormDto,
  TechFormDtoOptional,
} from './tech.dto';
import { ApiErrorResponse } from 'src/shareds/presentation/api-error.decorator';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';
import { ApiSuccessResponse } from 'src/shareds/presentation/api-success.decorator';
import { ResCodes } from '@skrteeeeee/profile-domain/dist/flows/res.type';
import {
  ActualizarGithubParams,
  ReadAllParams,
} from '@skrteeeeee/profile-domain/dist/entities/tech.type';
import { VoidDto } from 'src/shareds/presentation/pipes/void.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Tech')
@Controller('/tech')
export class TechController {
  constructor(
    // private readonly techCreateService: TechCreateUseCase<DBBase>,
    private readonly techOctokitUpdateRepo: TechOctokitUpdateRepo,
    private readonly techOctokitActualizarGithubRepo: TechOctokitActualizarGithubRepo,
    private readonly techOctokitCreateRepo: TechOctokitCreateRepo,
    private readonly techFindAndDeleteRepo: TechFindDeleteRepo,
    private readonly techReadService: TechReadUseCase,
    // private readonly techReadByIdService: TechReadByIdUseCase<DBBase>,
    // private readonly techUpdateService: TechUpdateUseCase<DBBase>,
    // private readonly techUpdateByIdService: TechUpdateByIdUseCase<DBBase>,
    // private readonly techDeleteService: TechDeleteUseCase<DBBase>
  ) {}

  @Delete('/:nameId')
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('d', ErrorCodes.SHARED_ACTION)
  @ApiSuccessResponse(LangDto, ResCodes.ENTITY_DELETED)
  @ApiOperation({
    summary: '🗑️ Delete - Remove technology by nameId',
    description: `Deletes a technology and all its associated data by its unique nameId.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- 🗝️ **Parameter**: \`nameId\` (string) — Unique identifier for the technology to delete.
- ✅ **Response**: Returns the deleted technology object, including its database metadata (id, createdAt, updatedAt).

Use this endpoint to permanently remove a technology from the system.`,
  })
  async delete(@Param('nameId') nameId: string) {
    return await this.techFindAndDeleteRepo.findAndDelete(nameId);
  }

  @Get('/:type') //can be: /db, /flatten, /cat, /full
  @PublicRoute()
  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { limit: 1, ttl: 60 } })
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(1 * 60 * 60)
  // @ApiErrorResponse('get', '--protected') // Nose porque le puse --protected si no debería sacar un unauthorized
  @ApiErrorResponse('get')
  @ApiSuccessResponse(FullTechDataDto, ResCodes.ENTITIES_FOUND, true) //Hay que mostrar lo que devuelve
  @ApiParam({ name: 'type', enum: ReadAllParams })
  @ApiOperation({
    summary: `📖 Read - All (db, flatten, cat, full)`,
    description: `Returns a list of available technologies with different formats.

- 🌐 **Public endpoint**: No authentication required.
- 🗝️ **Parameter**: \`type\` (string) 
    - Db: nested format 
    - Flatten: flatten format
    - Cat: used langs and fws (not libs)
    - Full: all data (db, flatten and cat)

- 📦 **Response**: Depends on the type parameter

Useful for listing, searching, or filtering technologies in the application.`,
  })
  async readAll(@Param('type') type: ReadAllParams) {
    switch (type) {
      case ReadAllParams.Category:
        return await this.techReadService.readAllCat();
      case ReadAllParams.Full:
        return await this.techReadService.readAllC();
      case ReadAllParams.Db:
        return await this.techReadService.readAll();
      case ReadAllParams.Flatten:
        return await this.techReadService.readAllFlatten();
    }
  }

  @Patch('/:type') // can be /all or /json or /md
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('d', ErrorCodes.SHARED_ACTION)
  @ApiSuccessResponse(VoidDto, ResCodes.OPERATION_SUCCESS)
  @ApiParam({ name: 'type', enum: ActualizarGithubParams })
  @ApiOperation({
    summary: `♻️ Update - Github files (all, json, md)`,
    description: `Update the actual info in Github.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- 🗝️ **Parameter**: \`type\` (string) 
    - All: Update info in json and markdown Github files 
    - Json: Update info in json Github file
    - Md: Update info in markdown Github file

- 📦 **Response**: No special response, only the Flow Response

Useful for manage specials flow of the app.`,
  })
  async actualizarGithub(@Param('type') type: ActualizarGithubParams) {
    if (!Object.values(ActualizarGithubType).includes(type))
      throw createDomainError(
        ErrorCodes.INPUT_PARSE,
        TechController,
        'actualizarGithub',
        {
          en: 'Invalid route',
          es: 'Ruta inválida',
          ca: 'Ruta invàlida',
          de: 'Ungültiger Pfad',
        },
      );
    return await this.techOctokitActualizarGithubRepo.actualizar({
      type: ActualizarGithubType[type],
    });
  }

  @Put()
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('d', ErrorCodes.SHARED_ACTION)
  @ApiSuccessResponse(TechDto, ResCodes.ENTITY_UPDATED)
  @ApiOperation({
    summary: `♻️ Update - Edit technologies with new info`,
    description: `Update the actual information of a technology.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- ➕ **Operation**: Update a technology and update json github file.
- 📝 **Request body**: \`Tech Form Optional\`, **must have \`nameId\`**.
- 📦 **Response**: Return the info of the updated tech 

Useful for update info of the techs.`,
  })
  async update(@Body() tech: TechFormDtoOptional) {
    return await this.techOctokitUpdateRepo.update(tech);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('d', ErrorCodes.SHARED_ACTION)
  @ApiSuccessResponse(LangDto, ResCodes.ENTITY_CREATED)
  @ApiOperation({
    summary: '🆕 Create - Add new technology',
    description: `Add new technology to the system.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- ➕ **Operation**: Generate required info, update json and md github files and add new technology.
- 📝 **Request body**: \`Tech Form\`. Provide all the required info.
- ✅ **Response**: Returns the list of newly add technology, including their database metadata (id, createdAt, updatedAt).

Use this endpoint to keep the technology catalog updated with the latest additions.`,
  })
  async create(@Body() tech: TechFormDto) {
    return await this.techOctokitCreateRepo.create(tech);
  }
}
