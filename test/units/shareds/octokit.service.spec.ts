import { OctokitRepo } from 'src/shareds/octokit/infrastructure/octokit.service';
import { TopicCalculatorUseCase } from 'src/shareds/topic/application/topic-calculator.usecase';

describe('OctokitRepo', () => {
  let service: OctokitRepo;
  let topicCalculatorUseCase: TopicCalculatorUseCase;
  let mockOctokit: any;

  beforeEach(() => {
    topicCalculatorUseCase = {
      calculateTopicGithubData: jest.fn(),
      calculateAllTopicSizePercentages: jest.fn(),
      calculateAllTopicsRepoPercentages: jest.fn(),
    } as any;

    service = new OctokitRepo(topicCalculatorUseCase);

    // Mock the getOctokit method
    mockOctokit = {
      repos: {
        listForUser: jest.fn(),
        get: jest.fn(),
        listLanguages: jest.fn(),
        createOrUpdateFileContents: jest.fn(),
        getContent: jest.fn(),
      },
      request: jest.fn(),
    };

    jest.spyOn(service, 'getOctokit' as any).mockResolvedValue(mockOctokit);
  });

  describe('getReposDetails', () => {
    it('should fetch and return repository details', async () => {
      const mockRepos = [
        { name: 'repo1' },
        { name: 'repo2' },
      ];

      const mockRepoDetails = {
        data: {
          size: 1000,
          topics: ['typescript', 'nodejs'],
          html_url: 'https://github.com/owner/repo1',
          description: 'Test repo',
        },
      };

      const mockLanguages = {
        data: { TypeScript: 5000, JavaScript: 3000 },
      };

      mockOctokit.repos.listForUser.mockResolvedValue({ data: mockRepos });
      mockOctokit.repos.get.mockResolvedValue(mockRepoDetails);
      mockOctokit.repos.listLanguages.mockResolvedValue(mockLanguages);

      const result = await service.getReposDetails('testOwner');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('size');
      expect(result[0]).toHaveProperty('languages');
      expect(result[0]).toHaveProperty('topics');
      expect(mockOctokit.repos.listForUser).toHaveBeenCalledWith({
        username: 'testOwner',
        per_page: 100,
      });
    });

    it('should handle empty repository list', async () => {
      mockOctokit.repos.listForUser.mockResolvedValue({ data: [] });

      const result = await service.getReposDetails('testOwner');

      expect(result).toEqual([]);
    });

    it('should handle repositories without topics', async () => {
      const mockRepos = [{ name: 'repo1' }];

      const mockRepoDetails = {
        data: {
          size: 1000,
          topics: null,
          html_url: 'https://github.com/owner/repo1',
          description: 'Test repo',
        },
      };

      const mockLanguages = {
        data: { TypeScript: 5000 },
      };

      mockOctokit.repos.listForUser.mockResolvedValue({ data: mockRepos });
      mockOctokit.repos.get.mockResolvedValue(mockRepoDetails);
      mockOctokit.repos.listLanguages.mockResolvedValue(mockLanguages);

      const result = await service.getReposDetails('testOwner');

      expect(result[0].topics).toEqual([]);
    });
  });

  describe('getTopicGithubData', () => {
    it('should calculate topic github data', async () => {
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

      jest.spyOn(service, 'getReposDetails').mockResolvedValue(mockRepoDetails);

      const mockCalculatedData = {
        topicSizePer: 50,
        topicRepoPer: 75,
        topicRepoFrac: '3/4',
        topicImportanceScore: 62.5,
      };

      (topicCalculatorUseCase.calculateAllTopicSizePercentages as jest.Mock).mockReturnValue([]);
      (topicCalculatorUseCase.calculateAllTopicsRepoPercentages as jest.Mock).mockReturnValue([]);
      (topicCalculatorUseCase.calculateTopicGithubData as jest.Mock).mockReturnValue(mockCalculatedData);

      const result = await service.getTopicGithubData('typescript', 'testOwner');

      expect(result).toEqual(mockCalculatedData);
      expect(topicCalculatorUseCase.calculateTopicGithubData).toHaveBeenCalled();
    });
  });

  describe('updateFileContent', () => {
    it('should update file content successfully', async () => {
      const baseOptions = {
        owner: 'testOwner',
        repo: 'testRepo',
        ref: 'main',
      };

      const updateOptions = {
        message: 'Update file',
        content: 'New content',
      };

      mockOctokit.repos.getContent.mockResolvedValue({
        data: { sha: 'abc123' },
      });
      mockOctokit.repos.createOrUpdateFileContents.mockResolvedValue({});

      await service.updateFileContent('test.txt', baseOptions, updateOptions);

      expect(mockOctokit.repos.createOrUpdateFileContents).toHaveBeenCalled();
    });

    it('should retry on 409 conflict', async () => {
      const baseOptions = {
        owner: 'testOwner',
        repo: 'testRepo',
        ref: 'main',
      };

      const updateOptions = {
        message: 'Update file',
        content: 'New content',
      };

      mockOctokit.repos.getContent
        .mockResolvedValueOnce({ data: { sha: 'old-sha' } })
        .mockResolvedValueOnce({ data: { sha: 'new-sha' } });

      mockOctokit.repos.createOrUpdateFileContents
        .mockRejectedValueOnce({ status: 409 })
        .mockResolvedValueOnce({});

      await service.updateFileContent('test.txt', baseOptions, updateOptions);

      expect(mockOctokit.repos.createOrUpdateFileContents).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries', async () => {
      const baseOptions = {
        owner: 'testOwner',
        repo: 'testRepo',
        ref: 'main',
      };

      const updateOptions = {
        message: 'Update file',
        content: 'New content',
      };

      mockOctokit.repos.getContent.mockResolvedValue({
        data: { sha: 'abc123' },
      });

      mockOctokit.repos.createOrUpdateFileContents.mockRejectedValue({
        status: 409,
      });

      await expect(
        service.updateFileContent('test.txt', baseOptions, updateOptions, 2),
      ).rejects.toThrow();
    });

    it('should throw error for non-409 errors', async () => {
      const baseOptions = {
        owner: 'testOwner',
        repo: 'testRepo',
        ref: 'main',
      };

      const updateOptions = {
        message: 'Update file',
        content: 'New content',
      };

      mockOctokit.repos.getContent.mockResolvedValue({
        data: { sha: 'abc123' },
      });

      const error = { status: 500, message: 'Server error' };
      mockOctokit.repos.createOrUpdateFileContents.mockRejectedValue(error);

      await expect(
        service.updateFileContent('test.txt', baseOptions, updateOptions),
      ).rejects.toThrow();
    });
  });
});
