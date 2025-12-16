import { Injectable } from '@nestjs/common';
import { FwBase, LengBase, TechBase, TechForm } from '@skrteeeeee/profile-domain/dist/entities/tech';
import { TechReadUseCase } from 'src/modules/tech/application/tech-read.usecase';
import {
  TechCreateUseCase,
  TechReadOneUseCase,
  TechUpdateUseCase,
} from 'src/modules/tech/application/tech.usecase';
import { DBBase } from 'src/dynamic.types';;
import { OctokitRepo } from 'src/shareds/octokit/infrastructure/octokit.service';
import {
  ActualizarGithubType,
  TechOctokitActualizarGithubRepo,
} from './actualizar.repo';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';

@Injectable()
export class TechOctokitCreateRepo {
  constructor(
    private readonly techCreateService: TechCreateUseCase,
    private readonly techReadService: TechReadUseCase,
    private readonly techReadOneService: TechReadOneUseCase,
    private readonly techUpdateService: TechUpdateUseCase,
    private readonly octokit: OctokitRepo, //github percentage
    private readonly techOctokitActualizarGithubRepo: TechOctokitActualizarGithubRepo,
    // private readonly octokitUFCService: OctokitUpdateFileContentService//github actualizarTech
  ) {}
  async create(data: TechForm, owner = 'SKRTEEEEEE') {
    const {
      nameId,
      nameBadge,
      web,
      desc,
      afinidad,
      color,
      experiencia,
      img,
      lengTo,
      fwTo,
    } = data;
    try {
      // 1. Obtener el estado actual de la BD y calcular uso de GitHub
      // const proyectosDB = await this.techReadService.read({});
      const proyectosDB = await this.techReadService.readAll()
      const { topicSizePer: usoGithub } = await this.octokit.getTopicGithubData(
        nameId,
        owner,
      );
      // Calcular la siguiente preferencia disponible
      const nextPreference = await this.calculateNextPreference(
        proyectosDB,
        lengTo,
        fwTo,
      );

      const nuevoItem: TechBase = {
        nameId,
        nameBadge,
        color,
        web,
        usoGithub,
        desc,
        afinidad,
        experiencia,
        preferencia: nextPreference,
        img,
      };

      // 2. Guardar en la base de datos
      // let success = false;
      // let message = '';
      let lastResponse;

      if (!lengTo) {
        // Caso 1: Publicar un nuevo lenguaje
        const nuevoLenguaje = await this.techCreateService.create(nuevoItem);

        lastResponse = nuevoLenguaje;
      } else {
        const lenguaje = await this.techReadOneService.readOne({
          filter: { nameId: lengTo },
        });
        if (!lenguaje) {
          return {
            success: false,
            message: `Lenguaje no encontrado: ${lengTo}`,
          };
        }

        if (!fwTo) {
          // Caso 2: Agregar un framework a un lenguaje
          lenguaje.frameworks?.push(nuevoItem as FwBase);
          const res = await this.techUpdateService.updateByNameId(
            lengTo,
            lenguaje,
          );
          const frameworkAgregado = res?.frameworks?.some(
            (fw) => fw.nameId === nuevoItem.nameId,
          );
          if (!frameworkAgregado)
            throw createDomainError(
              ErrorCodes.DATABASE_ACTION,
              TechOctokitCreateRepo,
              'update',
            );

          return res;
        } else {
          // Caso 3: Agregar una librería a un framework
          const framework = lenguaje.frameworks?.find(
            (fw: any) => fw.nameId === fwTo,
          );
          if (!framework) {
            return {
              success: false,
              message: `Framework no encontrado: ${fwTo}`,
            };
          }

          framework.librerias?.push(nuevoItem);

          lastResponse = await this.techUpdateService.updateByNameId(
            lengTo,
            lenguaje,
          );
        }
      }

      await this.techOctokitActualizarGithubRepo.actualizar({
        type: ActualizarGithubType.all,
        create: {
          base: { nameId, nameBadge, web, color },
          oldTechs: proyectosDB,
        },
      });
      return lastResponse;
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        TechOctokitCreateRepo,
        'create',
      );
    }
  }

  private findFirstAvailable(preferences: number[]): number {
    if (preferences.length === 0) return 1;

    const sortedPrefs = [...preferences].sort((a, b) => a - b);
    let expected = 1;

    for (const pref of sortedPrefs) {
      if (pref !== expected) {
        return expected;
      }
      expected++;
    }

    return expected;
  }
  private async calculateNextPreference(
    allTechs: (LengBase & DBBase)[],
    lengTo?: string,
    fwTo?: string,
  ): Promise<number> {
    // Case 1: Adding a language
    if (!lengTo) {
      const languagePreferences = allTechs.map((tech) => tech.preferencia);
      return this.findFirstAvailable(languagePreferences);
    }

    // Find the parent language
    const parentLang = allTechs.find((tech) => tech.nameId === lengTo);
    if (!parentLang) throw new Error(`Language ${lengTo} not found`);

    // Case 2: Adding a framework
    if (!fwTo) {
      const frameworkPreferences =
        parentLang.frameworks?.map((fw) => fw.preferencia) || [];
      return this.findFirstAvailable(frameworkPreferences);
    }

    // Case 3: Adding a library
    const parentFw = parentLang.frameworks?.find((fw) => fw.nameId === fwTo);
    if (!parentFw) throw new Error(`Framework ${fwTo} not found`);

    const libraryPreferences =
      parentFw.librerias?.map((lib) => lib.preferencia) || [];
    return this.findFirstAvailable(libraryPreferences);
  }
}
