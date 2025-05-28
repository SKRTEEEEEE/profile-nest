//Toda esta parte deberá tener su propio módulo

import { Injectable } from "@nestjs/common";
import { GithubOptionsBase, GithubOptionsUpdate,  OctokitInterface, RepoDetailsRes } from "src/shareds/octokit/application/octokit.interface";
import { OctokitConfig } from "./octokit.conn";
import { AllTopicSizePercentagesRes } from "src/shareds/topic/application/topic-calculator.interface";
import { TopicCalculatorUseCase } from "src/shareds/topic/application/topic-calculator.usecase";
export type LengPercentage = {
    name: string;
    percentage: number;
}

@Injectable()
export class OctokitRepo extends OctokitConfig implements OctokitInterface {
    constructor(
        private readonly topicCalculatorUseCase: TopicCalculatorUseCase
    ) {
        super();
    }
    //Aparte
    async updateFileContent(filePath: string, baseOptions: GithubOptionsBase, updateOptions: GithubOptionsUpdate, maxRetries = 3): Promise<void> {
        const octokit = await this.getOctokit();
        const { ref, repo, owner } = baseOptions;
        const { message, content } = updateOptions;
        const encodedContent = Buffer.from(content).toString("base64");
        let currentTry = 0;
        let lastError;
        let sha;
        while (currentTry < maxRetries) {
            try {
                sha = await this.fetchFileSha(filePath, baseOptions);
                await octokit.repos.createOrUpdateFileContents({
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
                    try {
                        const newSha = await this.fetchFileSha(filePath, baseOptions);
                        if (!newSha) throw new Error("No se pudo obtener el nuevo SHA");
                        sha = newSha;
                    } catch (shaError) {
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
    //Original
    async getReposDetails(owner: string): Promise<RepoDetailsRes> {
        const octokit = await this.getOctokit();
        // const rate = await octokit.request('GET /rate_limit');
        // console.log("Rate limit status:", rate.data.rate);
        // console.log("rate", rate)
        const { data: repos } = await octokit.repos.listForUser({
            username: owner,
            per_page: 100,
        });

        const reposDetails: RepoDetailsRes = await Promise.all(repos.map(async (repo) => {
            const { data: repoDetails } = await octokit.repos.get({
                owner,
                repo: repo.name
            });

            const { data: languages } = await octokit.repos.listLanguages({
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


    async getTopicGithubData(nameId: string, owner: string): Promise<{ topicSizePer: number, topicRepoPer: number, topicRepoFrac: string, topicImportanceScore: number }> {
        const reposDetails = await this.getReposDetails(owner);
        return this.topicCalculatorUseCase.calculateTopicGithubData(nameId,this.topicCalculatorUseCase.calculateAllTopicSizePercentages(reposDetails),this.topicCalculatorUseCase.calculateAllTopicsRepoPercentages(reposDetails))
        // const lengPor = this.getAllTopicsSizePercentage(reposDetails);
        // const allTopics = this.getAllTopicsRepoPercentage(reposDetails);
        // console.log(allTopics);

        // const replaceDashWithDot = (str: string) => str.replace(/-/g, '.');
        // const normalizedName = replaceDashWithDot(nameId.toLowerCase());

        // // Buscar el porcentaje de tamaño (useGithub)
        // const usogithubString = lengPor.find(lenguaje => {
        //     const searchedName = replaceDashWithDot(lenguaje.name.toLowerCase());
        //     return normalizedName === searchedName;
        // })?.percentage ?? 0;

        // // Buscar el porcentaje y fracción de repos (useReposPor, useReposFrac)
        // const topicStats = allTopics.find(topic => {
        //     const searchedName = replaceDashWithDot(topic.name.toLowerCase());
        //     return normalizedName === searchedName;
        // });

        // const useReposPor = topicStats?.topicRepoPer ?? 0;
        // const useReposFrac = topicStats?.topicRepoFrac ?? "0/0";

        // // Métrica de importancia combinada
        // const useImportancePor = parseFloat(((usogithubString * useReposPor) / 100).toFixed(2));

        // return {
        //     topicSizePer: usogithubString,
        //     topicRepoPer: useReposPor,
        //     topicRepoFrac: useReposFrac,
        //     topicImportanceScore: useImportancePor
        // };
    }

    private sumarPorcentajes(lengPor: { name: string; percentage: number }[]): number {
        return lengPor.reduce((acc, curr) => acc + curr.percentage, 0);
    }

    // private getAllTopicsRepoPercentage(reposDetails: RepoDetailsRes): { name: string, topicRepoPer: number, topicRepoFrac: string }[] {
    //     const filteredRepos = reposDetails.filter(repo => repo.topics.length > 0);
    //     const total = filteredRepos.length;
    //     if (total === 0) return [];

    //     // Cuenta cuántos repos usan cada topic
    //     const topicCount: { [topic: string]: number } = {};
    //     filteredRepos.forEach(repo => {
    //         repo.topics.forEach(topic => {
    //             topicCount[topic] = (topicCount[topic] || 0) + 1;
    //         });
    //     });

    //     // Devuelve el array con porcentaje y fracción
    //     return Object.entries(topicCount).map(([name, count]) => ({
    //         name,
    //         topicRepoPer: parseFloat(((count / total) * 100).toFixed(2)),
    //         topicRepoFrac: `${count}/${total}`
    //     }));
    // }
    // //Original
    // private getAllTopicsSizePercentage(reposDetails: RepoDetailsRes): AllTopicSizePercentagesRes {
    //     const filteredReposDetails = reposDetails.filter(repo => repo.topics.length > 0);
    //     const totalSize = filteredReposDetails.reduce((acc, repo) => acc + repo.size, 0);
    //     const languageWeights: { [key: string]: number } = {};
    //     filteredReposDetails.forEach(repo => {
    //         const weightPerLanguage = repo.size / repo.topics.length;
    //         repo.topics.forEach(topic => {
    //             if (languageWeights[topic]) {
    //                 languageWeights[topic] += weightPerLanguage;
    //             } else {
    //                 languageWeights[topic] = weightPerLanguage;
    //             }
    //         });
    //     });
    //     const languagePercentages: AllTopicSizePercentagesRes = Object.entries(languageWeights).map(([language, weight]) => ({
    //         name: language,
    //         percentage: (weight / totalSize) * 100
    //     }));
    //     return languagePercentages;
    // }

    // Aparte
    private async fetchFileSha(filePath: string, options: GithubOptionsBase): Promise<string | undefined> {
        const octokit = await this.getOctokit();
        const { owner, repo, ref } = options;
        try {
            const response = await octokit.repos.getContent({
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
            throw error;
        }
    }
}