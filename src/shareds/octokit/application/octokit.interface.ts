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
export type LengPercentage = {
    name: string;
    percentage: number;
}
export type OctokitInterface = {
    getReposDetails: (owner: string) => Promise<RepoDetailsRes>
    updateFileContent: (filePath: string,baseOptions: GithubOptionsBase ,updateOptions: GithubOptionsUpdate, maxRetries?: number) => Promise<void> // hay que cambiar por mensaje unificado
    getTechGithubPercentage: (nameId: string, owner: string) => Promise<number>
}
