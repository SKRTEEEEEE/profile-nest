import { Inject, Injectable } from "@nestjs/common";
import { OctokitRepository, GithubOptionsBase, GithubOptionsUpdate, RepoDetailsRes } from "src/application/interfaces/services/octokit.interface";

// ❌ Esta capa no tiene mucho sentido ahora mismo, ya que tendría sentido si esto fuera para algo genérico pero estos metodos son exclusivos de octokit que pertenece a la capa infra  -> 🧠 Aunque esto no quita que las capas de (app/interface) ESTAN BIEN

// Service for fetching repository details
@Injectable()
export class OctokitGetReposDetailsService {
    constructor(
        @Inject("OCTOKIT_REPOSITORY_TOKEN") 
        private readonly octokitRepository: OctokitRepository
    ) {}

    async getReposDetails(owner: string): Promise<RepoDetailsRes> {
        return await this.octokitRepository.getReposDetails(owner);
    }
}

// Service for updating file content in a repository
@Injectable()
export class OctokitUpdateFileContentService {
    constructor(
        @Inject("OCTOKIT_REPOSITORY_TOKEN") 
        private readonly octokitRepository: OctokitRepository
    ) {}

    async updateFileContent(
        filePath: string,
        baseOptions: GithubOptionsBase,
        updateOptions: GithubOptionsUpdate,
        maxRetries?: number
    ): Promise<void> {
        return await this.octokitRepository.updateFileContent(filePath, baseOptions, updateOptions, maxRetries);
    }
}

// Service for calculating GitHub language percentage
@Injectable()
export class OctokitGetTechGithubPercentageService {
    constructor(
        @Inject("OCTOKIT_REPOSITORY_TOKEN") 
        private readonly octokitRepository: OctokitRepository
    ) {}

    async getTechGithubPercentage(nameId: string, owner: string): Promise<number> {
        return await this.octokitRepository.getTechGithubPercentage(nameId, owner);
    }
}