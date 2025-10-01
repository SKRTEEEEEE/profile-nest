import { Injectable } from '@nestjs/common';
import { TechUpdateUseCase } from '../../application/tech.usecase';
import { DBBase } from 'src/dynamic.types';;
import {
  ActualizarGithubType,
  TechOctokitActualizarGithubRepo,
} from './actualizar.repo';
import { TechForm } from 'src/domain/entities/tech';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';

@Injectable()
export class TechOctokitUpdateRepo {
  constructor(
    private readonly techUpdateService: TechUpdateUseCase,
    private readonly techOctokitActualizarGithubRepo: TechOctokitActualizarGithubRepo,
  ) {}
  async update(updateData: Partial<TechForm>) {
    try {
      const proyectoActualizado =
        await this.techUpdateService.updateByForm(updateData);
      if (!proyectoActualizado)
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          TechOctokitUpdateRepo,
          'update',
          undefined,
          {
            optionalMessage: `No se encontró un proyecto llamado ${updateData.nameId}.`,
          },
        );

      await this.techOctokitActualizarGithubRepo.actualizar({
        type: ActualizarGithubType.json,
      });
      return proyectoActualizado;
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        TechOctokitUpdateRepo,
        'update',
        undefined,
        {
          optionalMessage:
            'Ocurrió un problema al intentar actualizar el proyecto. Por favor, intente de nuevo más tarde.',
        },
      );
    }
  }
}
