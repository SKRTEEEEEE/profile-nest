//Toda esta parte deberá tener su propio módulo

import { Injectable } from "@nestjs/common";
import { GithubOptionsBase, GithubOptionsUpdate, LengPercentage, OctokitRepository, RepoDetailsRes } from "src/application/interfaces/services/octokit.interface";
import { SetEnvError } from "src/domain/errors/domain.error";


@Injectable()
export class OctokitRepo  implements OctokitRepository{
       private auth = process.env.GITHUB_TOKEN
          private _octokit;
      
          constructor(){
              this._octokit = this.initialize()
          }
      
          private async initialize() {
    if (!this.auth) throw new SetEnvError("github token");
    const { Octokit } = await import("@octokit/rest");
    return new Octokit({ auth: this.auth });
}
          protected get octokit(){
              return this._octokit
          }

    async getReposDetails(owner: string): Promise<RepoDetailsRes> {
        const { data: repos } = await this.octokit.repos.listForUser({
            username: owner,
            per_page: 100,
        });

        const reposDetails: RepoDetailsRes = await Promise.all(repos.map(async (repo) => {
            const { data: repoDetails } = await this.octokit.repos.get({
                owner,
                repo: repo.name
            });

            const { data: languages } = await this.octokit.repos.listLanguages({
                owner,
                repo: repo.name
            });

            return {
                name: repo.name,
                size: repoDetails.size,
                languages: Object.keys(languages),
                topics: repoDetails.topics || [],
                html_url: repoDetails.html_url,
                description: repoDetails.description,
            };
        }));

        return reposDetails;
    }
    async updateFileContent(filePath: string,baseOptions: GithubOptionsBase ,updateOptions: GithubOptionsUpdate, maxRetries = 3): Promise<void> {
        const {ref, repo, owner}= baseOptions
        const {message, content} = updateOptions
        const encodedContent = Buffer.from(content).toString("base64");
        let currentTry = 0;
        let lastError;
        let sha;
        while (currentTry < maxRetries) {
            try {
                sha = await this.fetchFileSha(filePath, baseOptions)
                await this.octokit.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path: filePath,
                    message,
                    content: encodedContent,
                    sha,
                    branch: ref,
                });
                return; 
            } catch (error: any) {
                lastError = error;
                
                if (error.status === 409) {
                    console.log(`Intento ${currentTry + 1} fallido, obteniendo nuevo SHA...`);
                    try {
                        const newSha = await this.fetchFileSha(filePath, baseOptions);
                        if (!newSha) {
                            throw new Error("No se pudo obtener el nuevo SHA");
                        }
                        sha = newSha; // Actualizamos el SHA para el siguiente intento
                    } catch (shaError) {
                        console.error("Error obteniendo nuevo SHA:", shaError);
                        throw shaError;
                    }
                } else {
                    throw error;
                }
            }
            currentTry++;
            
            if (currentTry < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    
        throw lastError || new Error("No se pudo actualizar el archivo después de múltiples intentos");
    }
    async getTechGithubPercentage (nameId: string, owner: string):Promise<number>{
        const reposDetails = await this.getReposDetails(owner);
        const lengPor = this.calculateLanguagePercentages(reposDetails);
        const replaceDashWithDot = (str: string) => str.replace(/-/g, '.');
        const usogithubString = lengPor.find(lenguaje => {
            const normalizedName = nameId.toLowerCase();
            const modifiedName = replaceDashWithDot(normalizedName);
            const searchedName = replaceDashWithDot(lenguaje.name.toLowerCase());
            return modifiedName === searchedName;
        })?.percentage.toFixed(2);
        return usogithubString !== undefined ? parseFloat(usogithubString) : 0;
    }
    private calculateLanguagePercentages(reposDetails: RepoDetailsRes): LengPercentage[] {
        const filteredReposDetails = reposDetails.filter(repo => repo.topics.length > 0);
        const totalSize = filteredReposDetails.reduce((acc, repo) => acc + repo.size, 0);
        const languageWeights: { [key: string]: number } = {};
        filteredReposDetails.forEach(repo => {
            const weightPerLanguage = repo.size / repo.topics.length;
            repo.topics.forEach(topic => {
                if (languageWeights[topic]) {
                    languageWeights[topic] += weightPerLanguage;
                } else {
                    languageWeights[topic] = weightPerLanguage;
                }
            });
        });
        const languagePercentages: LengPercentage[] = [];
        for (const [language, weight] of Object.entries(languageWeights)) {
            languagePercentages.push({ name: language, percentage: (weight / totalSize) * 100 });
        }
        return languagePercentages;
    }
    private async fetchFileSha(filePath: string, options: GithubOptionsBase): Promise<string | undefined> {
        const {owner, repo, ref} = options
        try {
            const response = await this.octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref,
            });
    
            if (Array.isArray(response.data)) {
                const file = response.data.find((item) => item.name === filePath.split('/').pop());
                if (!file?.sha) {
                    throw new Error(`No se encontró el SHA para el archivo ${filePath}`);
                }
                return file.sha;
            } else {
                if (!response.data.sha) {
                    throw new Error(`No se encontró el SHA para el archivo ${filePath}`);
                }
                return response.data.sha;
            }
        } catch (error) {
            console.error(`Error obteniendo SHA para ${filePath}:`, error);
            throw error;
        }
    }
}