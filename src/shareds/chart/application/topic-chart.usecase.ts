import { Injectable } from '@nestjs/common';
import {
  RenderAlphaSimpleProps,
  renderTopicAlphaTripleProps,
  TopicChartInterface,
} from './topic-chart.interface';
import { TopicCalculatorUseCase } from 'src/shareds/topic/application/topic-calculator.usecase';
import { RepoDetailsRes } from 'src/shareds/octokit/application/octokit.interface';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';

@Injectable()
export class TopicChartUseCase implements TopicChartInterface {
  constructor(
    private readonly topicCalculatorUseCase: TopicCalculatorUseCase,
    private readonly topicChartRepository: TopicChartInterface,
  ) {}
  async renderTopicAlphaBarChart(
    owner: string,
    type: 'alpha-triple' | 'alpha-simple',
    reposDetails: RepoDetailsRes,
  ): Promise<Buffer> {
    const allTopicsSize =
      this.topicCalculatorUseCase.calculateAllTopicSizePercentages(
        reposDetails,
      );
    if (type === 'alpha-triple') {
      const allTopicsRepo =
        this.topicCalculatorUseCase.calculateAllTopicsRepoPercentages(
          reposDetails,
        );
      const top25 = allTopicsSize
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 25);
      const merged = allTopicsSize.map((topic) => {
        const rest = allTopicsRepo.find((r) => r.name === topic.name);
        if (!rest)
          console.warn(`No matching data found for topic: ${topic.name}`);
        return {
          ...topic,
          ...rest,
          topicImportanceScore: (topic.percentage * rest!.topicRepoPer) / 20,
        };
      });

      const labels = top25.map((d) => d.name);
      const topicsSizePer = top25.map((d) => d.percentage);
      const bubbleData = merged.map((d, i) => ({
        x: i,
        y: d.topicRepoPer,
        r: Math.max(1, d.topicRepoPer! * 0.2), // radio proporcional a topicRepoPer, mínimo 6
      }));
      const topicRepoFrac = merged.map((d) => d.topicRepoFrac);
      const topicImportanceScore = merged.map((d) => d.topicImportanceScore);

      return this.topicChartRepository.renderTopicAlphaTriple({
        owner,
        labels,
        topicsSizePer,
        bubbleData,
        topicImportanceScore,
      });
    } else if (type === 'alpha-simple') {
      throw createDomainError(
        ErrorCodes.NOT_IMPLEMENTED,
        TopicChartUseCase,
        'renderTopicAlphaBarChart',
      );
    }
    throw createDomainError(
      ErrorCodes.INPUT_PARSE,
      TopicChartUseCase,
      'renderTopicAlphaBarChart',
    );
  }
  async renderTopicAlphaTriple(
    props: renderTopicAlphaTripleProps,
  ): Promise<Buffer> {
    return this.topicChartRepository.renderTopicAlphaTriple(props);
  }
  async renderTopicAlphaSimple(props: RenderAlphaSimpleProps): Promise<Buffer> {
    return this.topicChartRepository.renderTopicAlphaSimple(props);
  }
}
