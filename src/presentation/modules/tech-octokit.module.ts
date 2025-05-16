import { Module } from "@nestjs/common";
import { TechReadService, TechReadOneService, TechUpdateService } from "src/application/usecases/entities/tech.service";
import { OctokitGetReposDetailsService, OctokitUpdateFileContentService, OctokitGetTechGithubPercentageService } from "src/application/usecases/services/octokit.service";
import { OctokitRepo } from "src/infrastructure/services/octokit.service";
import { TechOctokitActualizarGithubRepo } from "src/infrastructure/shareds/tech-octokit/actualizar.repo";
import { TechOctokitCreateRepo } from "src/infrastructure/shareds/tech-octokit/create.repo";
import { TechController } from "../controllers/tech.controller";

const OCTOKIT_REPOSITORY_TOKEN = "OCTOKIT_REPOSITORY_TOKEN";

@Module({
    controllers: [
        TechController
    ],
    providers: [
        // Tech services
        TechReadService,
        TechReadOneService,
        TechUpdateService,

        // Octokit services
        OctokitGetReposDetailsService,
        OctokitUpdateFileContentService,
        OctokitGetTechGithubPercentageService,

        // Repositories
        // TechOctokitRepo,
        OctokitRepo,
        TechOctokitActualizarGithubRepo,
        TechOctokitCreateRepo,

        // Binding OctokitRepository interface to OctokitRepo implementation
        {
            provide: OCTOKIT_REPOSITORY_TOKEN,
            useClass: OctokitRepo,
        },
    ],

})
export class TechOctokitModule {}