export type GithubOptionsUpdate = {
    message: string
    content: string
}
export type  GithubOptionsBase = {
    owner: string
    repo: string
    ref: string
}
export type RepoDetailsRes = {
    name: string;
    size: number;
    topics: string[];
    languages: string[];
    html_url: string;
    description: string | null;
}[]

export type OctokitInterface = {
    getReposDetails: (owner: string) => Promise<RepoDetailsRes>
    updateFileContent: (filePath: string,baseOptions: GithubOptionsBase ,updateOptions: GithubOptionsUpdate, maxRetries?: number) => Promise<void> // hay que cambiar por mensaje unificado
    // getTechGithubPercentage: (nameId: string, owner: string) => Promise<number>
    // getTechGithubPercentages: (nameId: string, owner: string) => Promise<{useGithub: number, useRepos: number}>
    getTopicGithubData(nameId: string, owner: string): Promise<{ topicSizePer: number, topicRepoPer: number, topicRepoFrac: string, topicImportanceScore: number }>
    // renderTopicAlphaBarChart(type: string, owner: string): Promise<Buffer>
}
