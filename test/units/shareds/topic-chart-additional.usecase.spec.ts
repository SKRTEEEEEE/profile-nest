import { TopicChartUseCase } from 'src/shareds/chart/application/topic-chart.usecase';
import { TopicCalculatorUseCase } from 'src/shareds/topic/application/topic-calculator.usecase';
import { TopicChartInterface } from 'src/shareds/chart/application/topic-chart.interface';

describe('TopicChartUseCase - Additional Tests', () => {
  let useCase: TopicChartUseCase;
  let topicCalculatorUseCase: TopicCalculatorUseCase;
  let topicChartRepository: TopicChartInterface;

  beforeEach(() => {
    topicCalculatorUseCase = {
      calculateAllTopicSizePercentages: jest.fn(),
      calculateAllTopicsRepoPercentages: jest.fn(),
    } as any;

    topicChartRepository = {
      renderTopicAlphaTriple: jest.fn(),
      renderTopicAlphaSimple: jest.fn(),
      renderTopicAlphaBarChart: jest.fn(),
    } as any;

    useCase = new TopicChartUseCase(
      topicCalculatorUseCase,
      topicChartRepository,
    );
  });

  describe('renderTopicAlphaBarChart', () => {
    it('should render alpha-triple chart successfully', async () => {
      const mockRepoDetails = [
        {
          name: 'repo1',
          size: 1000,
          languages: ['TypeScript'],
          topics: ['nodejs', 'typescript'],
          html_url: 'https://github.com/owner/repo1',
          description: 'Test',
        },
      ];

      const mockSizePercentages = [
        { name: 'nodejs', percentage: 60 },
        { name: 'typescript', percentage: 40 },
      ];

      const mockRepoPercentages = [
        { name: 'nodejs', topicRepoPer: 50, topicRepoFrac: '1/2' },
        { name: 'typescript', topicRepoPer: 50, topicRepoFrac: '1/2' },
      ];

      (topicCalculatorUseCase.calculateAllTopicSizePercentages as jest.Mock)
        .mockReturnValue(mockSizePercentages);
      (topicCalculatorUseCase.calculateAllTopicsRepoPercentages as jest.Mock)
        .mockReturnValue(mockRepoPercentages);

      const mockBuffer = Buffer.from('chart-image');
      (topicChartRepository.renderTopicAlphaTriple as jest.Mock)
        .mockResolvedValue(mockBuffer);

      const result = await useCase.renderTopicAlphaBarChart(
        'testOwner',
        'alpha-triple',
        mockRepoDetails,
      );

      expect(result).toBe(mockBuffer);
      expect(topicChartRepository.renderTopicAlphaTriple).toHaveBeenCalled();
    });

    it('should throw error for alpha-simple type (not implemented)', async () => {
      const mockRepoDetails = [];

      (topicCalculatorUseCase.calculateAllTopicSizePercentages as jest.Mock)
        .mockReturnValue([]);

      await expect(
        useCase.renderTopicAlphaBarChart('testOwner', 'alpha-simple', mockRepoDetails),
      ).rejects.toThrow();
    });

    it('should throw error for invalid chart type', async () => {
      const mockRepoDetails = [];

      (topicCalculatorUseCase.calculateAllTopicSizePercentages as jest.Mock)
        .mockReturnValue([]);

      await expect(
        useCase.renderTopicAlphaBarChart('testOwner', 'invalid-type' as any, mockRepoDetails),
      ).rejects.toThrow();
    });

    it('should handle topics with missing repo data', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const mockRepoDetails = [
        {
          name: 'repo1',
          size: 1000,
          languages: ['TypeScript'],
          topics: ['nodejs'],
          html_url: 'https://github.com/owner/repo1',
          description: 'Test',
        },
      ];

      const mockSizePercentages = [
        { name: 'nodejs', percentage: 100 },
        { name: 'orphan-topic', percentage: 0 },
      ];

      const mockRepoPercentages = [
        { name: 'nodejs', topicRepoPer: 100, topicRepoFrac: '1/1' },
      ];

      (topicCalculatorUseCase.calculateAllTopicSizePercentages as jest.Mock)
        .mockReturnValue(mockSizePercentages);
      (topicCalculatorUseCase.calculateAllTopicsRepoPercentages as jest.Mock)
        .mockReturnValue(mockRepoPercentages);

      const mockBuffer = Buffer.from('chart-image');
      (topicChartRepository.renderTopicAlphaTriple as jest.Mock)
        .mockResolvedValue(mockBuffer);

      await useCase.renderTopicAlphaBarChart(
        'testOwner',
        'alpha-triple',
        mockRepoDetails,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No matching data found for topic:'),
      );

      consoleWarnSpy.mockRestore();
    });

    it('should limit to top 25 topics', async () => {
      const mockRepoDetails = [];
      
      // Create 30 topics
      const mockSizePercentages = Array.from({ length: 30 }, (_, i) => ({
        name: `topic${i}`,
        percentage: 30 - i,
      }));

      const mockRepoPercentages = mockSizePercentages.map(t => ({
        name: t.name,
        topicRepoPer: 50,
        topicRepoFrac: '1/2',
      }));

      (topicCalculatorUseCase.calculateAllTopicSizePercentages as jest.Mock)
        .mockReturnValue(mockSizePercentages);
      (topicCalculatorUseCase.calculateAllTopicsRepoPercentages as jest.Mock)
        .mockReturnValue(mockRepoPercentages);

      const mockBuffer = Buffer.from('chart-image');
      (topicChartRepository.renderTopicAlphaTriple as jest.Mock)
        .mockResolvedValue(mockBuffer);

      await useCase.renderTopicAlphaBarChart(
        'testOwner',
        'alpha-triple',
        mockRepoDetails,
      );

      const callArgs = (topicChartRepository.renderTopicAlphaTriple as jest.Mock).mock.calls[0][0];
      expect(callArgs.labels.length).toBeLessThanOrEqual(25);
    });
  });

  describe('renderTopicAlphaTriple', () => {
    it('should delegate to repository', async () => {
      const mockProps = {
        owner: 'testOwner',
        labels: ['nodejs', 'typescript'],
        topicsSizePer: [60, 40],
        bubbleData: [{ x: 0, y: 50, r: 10 }],
        topicImportanceScore: [30, 25],
      };

      const mockBuffer = Buffer.from('chart-image');
      (topicChartRepository.renderTopicAlphaTriple as jest.Mock)
        .mockResolvedValue(mockBuffer);

      const result = await useCase.renderTopicAlphaTriple(mockProps);

      expect(result).toBe(mockBuffer);
      expect(topicChartRepository.renderTopicAlphaTriple).toHaveBeenCalledWith(mockProps);
    });
  });

  describe('renderTopicAlphaSimple', () => {
    it('should delegate to repository', async () => {
      const mockProps = {
        owner: 'testOwner',
        labels: ['nodejs'],
        topicsSizePer: [100],
      };

      const mockBuffer = Buffer.from('chart-image');
      (topicChartRepository.renderTopicAlphaSimple as jest.Mock)
        .mockResolvedValue(mockBuffer);

      const result = await useCase.renderTopicAlphaSimple(mockProps);

      expect(result).toBe(mockBuffer);
      expect(topicChartRepository.renderTopicAlphaSimple).toHaveBeenCalledWith(mockProps);
    });
  });
});
