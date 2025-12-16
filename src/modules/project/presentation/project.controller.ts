import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProjectPopulateUseCase, ProjectReadByIdUseCase, ProjectReadEjemploUseCase } from "../application/project.usecase";
import { ProjectInterface } from "../application/project.interface";
import { ProjectBase } from '@skrteeeeee/profile-domain/dist/entities/project';
import { PublicRoute } from "src/shareds/jwt-auth/presentation/public-route.decorator";
import { ApiErrorResponse } from "src/shareds/presentation/api-error.decorator";
import { ApiSuccessResponse } from "src/shareds/presentation/api-success.decorator";
import { ProjectDto, ProjectFormDto } from "./project.dto";
import { ResCodes } from '@skrteeeeee/profile-domain/dist/flows/res.type';


@ApiTags('Project')
@Controller('/project')
export class ProjectController implements ProjectInterface {
  constructor(
    private readonly projectReadEjemploUseCase: ProjectReadEjemploUseCase,
    private readonly projectReadByIdUseCase: ProjectReadByIdUseCase,
    private readonly projectPopulateUseCase: ProjectPopulateUseCase,
  ) {}

  @Get()
  @PublicRoute()
  @ApiErrorResponse('get')
  @ApiSuccessResponse(ProjectDto, ResCodes.ENTITIES_FOUND, true)
  @ApiOperation({
    summary: '📖 Read - Example projects list',
    description: `Returns a list of example projects stored in the system.

- 🌐 **Public endpoint**: No authentication required.
- 🧩 **Operation**: Fetches the example projects from the database.
- 📦 **Response**: Returns an array of projects in \`ProjectDto\` format, including fields such as \`title\`, \`desc\`, and \`techs\`.

Use this endpoint to view the example projects displayed on the portfolio or demo section.`,
  })
  async readEjemplo() {
    return await this.projectReadEjemploUseCase.execute();
  }

  @Get(':id')
  @PublicRoute()
  @ApiErrorResponse('get')
  @ApiSuccessResponse(ProjectDto, ResCodes.ENTITY_FOUND)
  @ApiOperation({
    summary: '📖 Read - Project by ID',
    description: `Returns a single project by its ID.

- 🌐 **Public endpoint**: No authentication required.
- 🧩 **Operation**: Fetches a specific project from the database by its ID.
- 📦 **Response**: Returns a single project in \`ProjectDto\` format, or null if not found.

Use this endpoint to view the details of a specific project.`,
  })
  async readById(@Param('id') id: string) {
    return await this.projectReadByIdUseCase.execute(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiErrorResponse('d')
  @ApiSuccessResponse(ProjectDto, ResCodes.ENTITY_CREATED, true)
  @ApiOperation({
    summary: '🧱 Populate - Insert project data',
    description: `Populates the project collection with predefined data.

- 🛡️ **Protected endpoint**: Requires a valid access token.
- 📝 **Request body**: Array of \`ProjectBase\` objects, each representing a project with all required fields.
- ➕ **Operation**: Inserts or updates the given projects into the database.
- 📦 **Response**: Returns the created or updated projects with database metadata (id, createdAt, updatedAt).

Use this endpoint to bulk insert or refresh project data for testing or deployment environments.`,
  })
  async populate(@Body() data: ProjectFormDto[]) {
    return await this.projectPopulateUseCase.execute(data);
  }
}