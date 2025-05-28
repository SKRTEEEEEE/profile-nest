import { RepoDetailsRes } from "src/shareds/octokit/application/octokit.interface";

export type AllTopicSizePercentagesRes = {
    name: string;
    percentage: number;
}[]
export type AllTopicRepoPercentagesRes = { name: string, topicRepoPer: number, topicRepoFrac: string }[]

export type TopicGithubDataRes = { topicSizePer: number, topicRepoPer: number, topicRepoFrac: string, topicImportanceScore: number }

export abstract class TopicCalculatorInterface {
    abstract calculateAllTopicSizePercentages(reposDetails: RepoDetailsRes): AllTopicSizePercentagesRes
    abstract calculateAllTopicsRepoPercentages(reposDetails: RepoDetailsRes): AllTopicRepoPercentagesRes
    abstract calculateTopicGithubData(
        nameId: string,
        allTopicsSize: AllTopicSizePercentagesRes,
        allTopicsRepo: AllTopicRepoPercentagesRes): TopicGithubDataRes
}