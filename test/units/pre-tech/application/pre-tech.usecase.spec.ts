import { PreTechEndpointUseCase } from '../../../../src/modules/pre-tech/application/pre-tech.usecase';
import { PreTechInterface } from '../../../../src/modules/pre-tech/application/pre-tech.interface';

describe('PreTechEndpointUseCase', () => {
  let useCase: PreTechEndpointUseCase<any>;
  let mockPreTechRepository: jest.Mocked<PreTechInterface<any>>;

  beforeEach(() => {
    mockPreTechRepository = {
      updatePreTech: jest.fn(),
      readByQuery: jest.fn(),
    } as any;

    useCase = new PreTechEndpointUseCase(mockPreTechRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('updatePreTech', () => {
    it('should call repository updatePreTech method', async () => {
      mockPreTechRepository.updatePreTech.mockResolvedValue(undefined);

      const result = await useCase.updatePreTech();

      expect(result).toBeUndefined();
      expect(mockPreTechRepository.updatePreTech).toHaveBeenCalled();
    });

    it('should handle errors from repository', async () => {
      const error = new Error('Repository error');
      mockPreTechRepository.updatePreTech.mockRejectedValue(error);

      await expect(useCase.updatePreTech()).rejects.toThrow('Repository error');
    });
  });

  describe('readByQuery', () => {
    it('should call repository readByQuery with correct query', async () => {
      const query = { q: 'typescript' };
      const mockResult = [{ nameId: 'typescript', name: 'TypeScript' }];
      mockPreTechRepository.readByQuery.mockResolvedValue(mockResult);

      const result = await useCase.readByQuery(query);

      expect(result).toEqual(mockResult);
      expect(mockPreTechRepository.readByQuery).toHaveBeenCalledWith(query);
    });

    it('should handle empty query results', async () => {
      const query = { q: 'nonexistent' };
      mockPreTechRepository.readByQuery.mockResolvedValue([]);

      const result = await useCase.readByQuery(query);

      expect(result).toEqual([]);
      expect(mockPreTechRepository.readByQuery).toHaveBeenCalledWith(query);
    });

    it('should handle repository errors', async () => {
      const query = { q: 'test' };
      const error = new Error('Query failed');
      mockPreTechRepository.readByQuery.mockRejectedValue(error);

      await expect(useCase.readByQuery(query)).rejects.toThrow('Query failed');
    });
  });
});
