import { Injectable } from '@nestjs/common';
import {
  AllTopicRepoPercentagesRes,
  AllTopicSizePercentagesRes,
  TopicCalculatorInterface,
  TopicGithubDataRes,
} from './topic-calculator.interface';
import { RepoDetailsRes } from 'src/shareds/octokit/application/octokit.interface';

@Injectable()
export class TopicCalculatorUseCase implements TopicCalculatorInterface {
  calculateAllTopicSizePercentages(
    reposDetails: RepoDetailsRes,
  ): AllTopicSizePercentagesRes {
    const filteredReposDetails = reposDetails.filter(
      (repo) => repo.topics.length > 0,
    );
    const totalSize = filteredReposDetails.reduce(
      (acc, repo) => acc + repo.size,
      0,
    );
    const languageWeights: { [key: string]: number } = {};
    filteredReposDetails.forEach((repo) => {
      const weightPerLanguage = repo.size / repo.topics.length;
      repo.topics.forEach((topic) => {
        if (languageWeights[topic]) {
          languageWeights[topic] += weightPerLanguage;
        } else {
          languageWeights[topic] = weightPerLanguage;
        }
      });
    });
    const languagePercentages: AllTopicSizePercentagesRes = Object.entries(
      languageWeights,
    ).map(([language, weight]) => ({
      name: language,
      percentage: (weight / totalSize) * 100,
    }));
    return languagePercentages;
  }
  calculateAllTopicsRepoPercentages(
    reposDetails: RepoDetailsRes,
  ): AllTopicRepoPercentagesRes {
    const filteredRepos = reposDetails.filter((repo) => repo.topics.length > 0);
    const total = filteredRepos.length;
    if (total === 0) return [];

    // Cuenta cuántos repos usan cada topic
    const topicCount: { [topic: string]: number } = {};
    filteredRepos.forEach((repo) => {
      repo.topics.forEach((topic) => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
    });

    // Devuelve el array con porcentaje y fracción
    return Object.entries(topicCount).map(([name, count]) => ({
      name,
      topicRepoPer: parseFloat(((count / total) * 100).toFixed(2)),
      topicRepoFrac: `${count}/${total}`,
    }));
  }
  calculateTopicGithubData(
    nameId: string,
    allTopicsSize: AllTopicSizePercentagesRes,
    allTopicsRepo: AllTopicRepoPercentagesRes,
  ): TopicGithubDataRes {
    const replaceDashWithDot = (str: string) => str.replace(/-/g, '.');
    const normalizedName = replaceDashWithDot(nameId.toLowerCase());

    // Buscar el porcentaje de tamaño (useGithub)
    const usogithubString =
      allTopicsSize.find((lenguaje) => {
        const searchedName = replaceDashWithDot(lenguaje.name.toLowerCase());
        return normalizedName === searchedName;
      })?.percentage ?? 0;

    // Buscar el porcentaje y fracción de repos (useReposPor, useReposFrac)
    const topicStats = allTopicsRepo.find((topic) => {
      const searchedName = replaceDashWithDot(topic.name.toLowerCase());
      return normalizedName === searchedName;
    });

    const useReposPor = topicStats?.topicRepoPer ?? 0;
    const useReposFrac = topicStats?.topicRepoFrac ?? '0/0';

    // Métrica de importancia combinada
    const useImportancePor = parseFloat(
      ((usogithubString * useReposPor) / 100).toFixed(2),
    );

    return {
      topicSizePer: usogithubString,
      topicRepoPer: useReposPor,
      topicRepoFrac: useReposFrac,
      topicImportanceScore: useImportancePor,
    };
  }
}
