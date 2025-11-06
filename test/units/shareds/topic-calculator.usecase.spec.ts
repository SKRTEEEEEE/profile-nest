import { Test, TestingModule } from '@nestjs/testing';
import { TopicCalculatorUseCase } from '../../../src/shareds/topic/application/topic-calculator.usecase';

describe('TopicCalculatorUseCase', () => {
  let useCase: TopicCalculatorUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicCalculatorUseCase],
    }).compile();

    useCase = module.get<TopicCalculatorUseCase>(TopicCalculatorUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('calculateAllTopicSizePercentages', () => {
    it('should aggregate repo size per topic and normalize percentages', () => {
      const repos = [
        { topics: ['node', 'ts'], size: 100 } as any,
        { topics: ['node'], size: 50 } as any,
        { topics: [], size: 999 } as any, // ignored
      ];

      const result = useCase.calculateAllTopicSizePercentages(repos);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'node' }),
          expect.objectContaining({ name: 'ts' }),
        ]),
      );
      const total = result.reduce((acc, item) => acc + item.percentage, 0);
      expect(total).toBeCloseTo(100);
    });
  });

  describe('calculateAllTopicsRepoPercentages', () => {
    it('should calculate repo coverage for each topic', () => {
      const repos = [
        { topics: ['node', 'ts'] } as any,
        { topics: ['node'] } as any,
        { topics: [] } as any,
      ];

      const result = useCase.calculateAllTopicsRepoPercentages(repos as any);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'node', topicRepoFrac: '2/2' }),
          expect.objectContaining({ name: 'ts', topicRepoFrac: '1/2' }),
        ]),
      );
    });
  });

  describe('calculateTopicGithubData', () => {
    it('should merge percentages and compute importance score', () => {
      const size = [
        { name: 'nodejs', percentage: 40 },
        { name: 'typescript', percentage: 60 },
      ];
      const repo = [
        { name: 'nodejs', topicRepoPer: 50, topicRepoFrac: '1/2' },
        { name: 'typescript', topicRepoPer: 75, topicRepoFrac: '2/2' },
      ];

      const data = useCase.calculateTopicGithubData('typescript', size, repo);

      expect(data).toEqual({
        topicSizePer: 60,
        topicRepoPer: 75,
        topicRepoFrac: '2/2',
        topicImportanceScore: expect.any(Number),
      });
      expect(data.topicImportanceScore).toBeCloseTo((60 * 75) / 100);
    });

    it('should fallback to zeros when topic not found', () => {
      const data = useCase.calculateTopicGithubData('unknown', [], []);
      expect(data).toEqual({
        topicSizePer: 0,
        topicRepoPer: 0,
        topicRepoFrac: '0/0',
        topicImportanceScore: 0,
      });
    });
  });
});
