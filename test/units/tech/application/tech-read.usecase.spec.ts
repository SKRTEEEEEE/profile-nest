import { TechReadUseCase } from '../../../../src/modules/tech/application/tech-read.usecase';
import { TechRepository } from '../../../../src/modules/tech/application/tech.interface';
import { LengBase } from '../../../../src/domain/entities/tech';
import { DBBase } from '../../../../src/dynamic.types';

describe('TechReadUseCase', () => {
  let useCase: TechReadUseCase;
  let mockTechRepository: jest.Mocked<TechRepository>;

  const mockTechWithFrameworks: LengBase & DBBase = {
    nameId: 'typescript',
    name: 'TypeScript',
    nameBadge: 'TypeScript',
    icon: 'typescript-icon.png',
    img: 'typescript.png',
    type: 'language',
    afinidad: 85,
    experiencia: 90,
    color: '#3178c6',
    preferencia: 95,
    web: 'https://typescriptlang.org',
    desc: { es: 'TypeScript es un lenguaje', en: 'TypeScript is a language', ca: 'TypeScript és un llenguatge', de: 'TypeScript ist eine Sprache' },
    usoGithub: 5.2,
    frameworks: [
      {
        nameId: 'nestjs',
        name: 'NestJS',
        nameBadge: 'NestJS',
        icon: 'nestjs-icon.png',
        img: 'nestjs.png',
        type: 'framework',
        afinidad: 80,
        experiencia: 85,
        color: '#e0234e',
        preferencia: 90,
        web: 'https://nestjs.com',
        desc: { es: 'Framework de Node.js', en: 'Node.js Framework', ca: 'Framework de Node.js', de: 'Node.js Framework' },
        usoGithub: 4.5,
        librerias: [
          {
            nameId: 'typeorm',
            name: 'TypeORM',
            nameBadge: 'TypeORM',
            icon: 'typeorm-icon.png',
            img: 'typeorm.png',
            type: 'library',
            afinidad: 70,
            experiencia: 75,
            color: '#fe0902',
            preferencia: 80,
            web: 'https://typeorm.io',
            desc: { es: 'ORM para TypeScript', en: 'ORM for TypeScript', ca: 'ORM per TypeScript', de: 'ORM für TypeScript' },
            usoGithub: 3.2,
          },
        ],
      },
    ],
    id: 'tech-id-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTechWithoutFrameworks: LengBase & DBBase = {
    nameId: 'python',
    name: 'Python',
    nameBadge: 'Python',
    icon: 'python-icon.png',
    img: 'python.png',
    type: 'language',
    afinidad: 65,
    experiencia: 70,
    color: '#3776ab',
    preferencia: 75,
    web: 'https://python.org',
    desc: { es: 'Python es un lenguaje', en: 'Python is a language', ca: 'Python és un llenguatge', de: 'Python ist eine Sprache' },
    usoGithub: 2.1,
    frameworks: [],
    id: 'tech-id-456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    mockTechRepository = {
      read: jest.fn(),
    } as any;

    useCase = new TechReadUseCase(mockTechRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('readAllC', () => {
    it('should return complete tech data with flatten techs', async () => {
      mockTechRepository.read.mockResolvedValue([mockTechWithFrameworks]);

      const result = await useCase.readAllC();

      expect(result).toBeDefined();
      expect(result.techs).toEqual([mockTechWithFrameworks]);
      expect(result.flattenTechs).toBeDefined();
      expect(result.dispoLeng).toEqual([{ name: 'typescript' }]);
      expect(result.dispoFw).toEqual([{ name: 'nestjs' }]);
      expect(mockTechRepository.read).toHaveBeenCalledWith({});
    });

    it('should handle techs without frameworks', async () => {
      mockTechRepository.read.mockResolvedValue([mockTechWithoutFrameworks]);

      const result = await useCase.readAllC();

      expect(result.dispoFw).toEqual([]);
      expect(result.dispoLeng).toEqual([{ name: 'python' }]);
    });

    it('should handle multiple techs with mixed frameworks', async () => {
      mockTechRepository.read.mockResolvedValue([
        mockTechWithFrameworks,
        mockTechWithoutFrameworks,
      ]);

      const result = await useCase.readAllC();

      expect(result.dispoLeng).toHaveLength(2);
      expect(result.dispoFw).toHaveLength(1);
    });
  });

  describe('readAll', () => {
    it('should read all techs', async () => {
      const techs = [mockTechWithFrameworks, mockTechWithoutFrameworks];
      mockTechRepository.read.mockResolvedValue(techs);

      const result = await useCase.readAll();

      expect(result).toEqual(techs);
      expect(mockTechRepository.read).toHaveBeenCalledWith({});
    });
  });

  describe('readAllFlatten', () => {
    it('should return flattened tech data', async () => {
      mockTechRepository.read.mockResolvedValue([mockTechWithFrameworks]);

      const result = await useCase.readAllFlatten();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // Should have language + framework + library = 3 items
      expect(result.length).toBe(3);
      
      // Check language level
      expect(result[0].nameId).toBe('typescript');
      expect(result[0].isFw).toBeUndefined();
      expect(result[0].isLib).toBeUndefined();
      
      // Check framework level
      expect(result[1].nameId).toBe('nestjs');
      expect(result[1].isFw).toBe('typescript');
      expect(result[1].isLib).toBeUndefined();
      
      // Check library level
      expect(result[2].nameId).toBe('typeorm');
      expect(result[2].isFw).toBe('typescript');
      expect(result[2].isLib).toBe('nestjs');
    });

    it('should calculate color values correctly for high affinity (>80)', async () => {
      mockTechRepository.read.mockResolvedValue([mockTechWithFrameworks]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueAfin).toBe('max'); // afinidad = 85
      expect(result[0].valueExp).toBe('max'); // experiencia = 90
    });

    it('should calculate Github uso values correctly', async () => {
      mockTechRepository.read.mockResolvedValue([mockTechWithFrameworks]);

      const result = await useCase.readAllFlatten();

      // usoGithub = 5.2 should be "Alto" (>4.0 and <=6.0)
      expect(result[0].valueUso).toBe('Alto');
    });
  });

  describe('readAllCat', () => {
    it('should return only categories without full techs', async () => {
      mockTechRepository.read.mockResolvedValue([mockTechWithFrameworks]);

      const result = await useCase.readAllCat();

      expect(result).toBeDefined();
      expect(result.dispoLeng).toEqual([{ name: 'typescript' }]);
      expect(result.dispoFw).toEqual([{ name: 'nestjs' }]);
      expect((result as any).techs).toBeUndefined();
      expect((result as any).flattenTechs).toBeUndefined();
    });
  });

  describe('Github uso value calculation', () => {
    it('should return "Ninguno" for 0 usage', async () => {
      const techZeroUsage = {
        ...mockTechWithoutFrameworks,
        usoGithub: 0,
      };
      mockTechRepository.read.mockResolvedValue([techZeroUsage]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueUso).toBe('Ninguno');
    });

    it('should return "Ínfimo" for very low usage (>0 and <=0.05)', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        usoGithub: 0.03,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueUso).toBe('Ínfimo');
    });

    it('should return "Minúsculo" for low usage (>0.05 and <=0.2)', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        usoGithub: 0.15,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueUso).toBe('Minúsculo');
    });

    it('should return "Dominante" for very high usage (>14.0)', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        usoGithub: 20,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueUso).toBe('Dominante');
    });
  });

  describe('Color value calculation', () => {
    it('should return "max/darkgreen" for values > 80', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        afinidad: 85,
        experiencia: 90,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueAfin).toBe('max');
      expect(result[0].valueExp).toBe('max');
    });

    it('should return "high/brightgreen" for values > 60 and <= 80', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        afinidad: 70,
        experiencia: 65,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueAfin).toBe('high');
      expect(result[0].valueExp).toBe('high');
    });

    it('should return "neut/blue" for values > 40 and <= 60', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        afinidad: 50,
        experiencia: 45,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueAfin).toBe('neut');
      expect(result[0].valueExp).toBe('neut');
    });

    it('should return "low/yellow" for values >= 20 and <= 40', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        afinidad: 30,
        experiencia: 25,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueAfin).toBe('low');
      expect(result[0].valueExp).toBe('low');
    });

    it('should return "min/red" for values < 20', async () => {
      const tech = {
        ...mockTechWithoutFrameworks,
        afinidad: 15,
        experiencia: 10,
      };
      mockTechRepository.read.mockResolvedValue([tech]);

      const result = await useCase.readAllFlatten();

      expect(result[0].valueAfin).toBe('min');
      expect(result[0].valueExp).toBe('min');
    });
  });
});
