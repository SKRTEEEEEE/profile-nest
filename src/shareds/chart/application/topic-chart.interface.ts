import { RepoDetailsRes } from "src/shareds/octokit/application/octokit.interface";

export type renderTopicAlphaTripleProps =  {
    owner: string, 
    labels: string[],
    topicsSizePer: number[],
    bubbleData: {
        x: number;
        y: number | undefined;
        r: number;
    }[],
    topicImportanceScore: number[]
}
export type RenderAlphaSimpleProps = {
    owner: string,
    labels: string[],
    topicsSizePer: number[],
}

export abstract class TopicChartInterface {
    abstract renderTopicAlphaBarChart(
        // owner: string,
        // topicsSizePer: { name: string, percentage: number }[],
        // topicRestData?: { name: string, topicRepoPer: number, topicRepoFrac: string }[]
        owner: string,
        type: "alpha-triple" | "alpha-simple",
        props: RepoDetailsRes
    ): Promise<Buffer>
    abstract renderTopicAlphaTriple(props: 
        {
            owner: string, 
            labels: string[],
            topicsSizePer: number[],
            bubbleData: {
                x: number;
                y: number | undefined;
                r: number;
            }[],
            topicImportanceScore: number[]
        }): Promise<Buffer>
    abstract renderTopicAlphaSimple(props:
        {
            owner: string,
            labels: string[],
            topicsSizePer: number[],
        }): Promise<Buffer>
}