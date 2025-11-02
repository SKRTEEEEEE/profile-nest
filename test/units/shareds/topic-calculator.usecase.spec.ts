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

  describe('calculateTopic', () => {
    it('should calculate topic score correctly', () => {
      const mockData = {
        preferencia: 80,
        afinidad: 75,
        experiencia: 70,
        usoGithub: 3.5,
      };

      const result = useCase.calculateTopic(mockData);

      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should handle zero values', () => {
      const mockData = {
        preferencia: 0,
        afinidad: 0,
        experiencia: 0,
        usoGithub: 0,
      };

      const result = useCase.calculateTopic(mockData);

      expect(result).toBe(0);
    });

    it('should handle maximum values', () => {
      const mockData = {
        preferencia: 100,
        afinidad: 100,
        experiencia: 100,
        usoGithub: 5.0,
      };

      const result = useCase.calculateTopic(mockData);

      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });
  });

  describe('calculateTopics', () => {
    it('should calculate multiple topics', () => {
      const mockTechs = [
        {
          preferencia: 80,
          afinidad: 75,
          experiencia: 70,
          usoGithub: 3.5,
        },
        {
          preferencia: 90,
          afinidad: 85,
          experiencia: 80,
          usoGithub: 4.0,
        },
      ];

      const result = useCase.calculateTopics(mockTechs);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      result.forEach(score => {
        expect(typeof score).toBe('number');
        expect(score).toBeGreaterThan(0);
      });
    });

    it('should return empty array for empty input', () => {
      const result = useCase.calculateTopics([]);

      expect(result).toEqual([]);
    });
  });
});
