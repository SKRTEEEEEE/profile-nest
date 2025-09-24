import { Test, TestingModule } from '@nestjs/testing';
import { PreTechController } from 'src/modules/pre-tech/presentation/pre-tech.controller';
import { PreTechEndpointUseCase } from 'src/modules/pre-tech/application/pre-tech.usecase';
import { RoleAuthTokenGuard } from 'src/shareds/role-auth/presentation/role-auth-token.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('PreTechController', () => {
  let controller: PreTechController;
  let service: jest.Mocked<PreTechEndpointUseCase<any>>;

  beforeEach(async () => {
    service = {
      updatePreTech: jest.fn(),
      readByQuery: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreTechController],
      providers: [{ provide: PreTechEndpointUseCase, useValue: service }],
    })
      .overrideGuard(RoleAuthTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PreTechController>(PreTechController);
  });

  // describe('updatePreTech', () => {
  //   it('should call service.updatePreTech', async () => {
  //     service.updatePreTech.mockResolvedValue(undefined);

  //     await controller.updatePreTech();

  //     expect(service.updatePreTech).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe('readByQuery', () => {
    it('should return result from service.readByQuery', async () => {
      const expected = [{ id: '123' }];
      service.readByQuery.mockResolvedValue(expected);

      const result = await controller.readByQuery({} as any);

      expect(result).toEqual(expected);
      expect(service.readByQuery).toHaveBeenCalledWith({});
    });
  });
});
