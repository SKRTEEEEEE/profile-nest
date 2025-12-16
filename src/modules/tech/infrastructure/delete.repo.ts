import { Injectable } from '@nestjs/common';
import {
  TechDeleteUseCase,
  TechReadOneUseCase,
} from '../application/tech.usecase';
import { DBBase } from 'src/dynamic.types';;
import { FwBase } from '@skrteeeeee/profile-domain/dist/entities/tech';
import { Document } from 'mongoose';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';
import { FwDocument, LibDocument } from './tech.schema';


// Lo suyo seria tener este archivo en el mismo delete de tech.repo.ts

@Injectable()
export class TechFindDeleteRepo {
  constructor(
    private readonly techReadOneService: TechReadOneUseCase,
    private readonly techDeleteService: TechDeleteUseCase,
  ) {}
  async findAndDelete(name: string) {
    try {
      let proyectoActualizado = null;

      // Buscar en librerías
      let lenguaje = await this.techReadOneService.readOne({
        filter: { 'frameworks.librerias.nameId': name },
      });
      if (lenguaje && Array.isArray(lenguaje.frameworks)) {
        const frameworkIndex = lenguaje.frameworks.findIndex(
          (fw: FwBase & Document) =>
            fw.librerias?.some((lib: LibDocument) => lib.nameId === name),
        );
        if (
          frameworkIndex !== -1 &&
          Array.isArray(lenguaje.frameworks[frameworkIndex]?.librerias)
        ) {
          const libreriaIndex = lenguaje.frameworks[
            frameworkIndex
          ].librerias.findIndex((lib: LibDocument) => lib.nameId === name);
          const libreria = lenguaje.frameworks[frameworkIndex].librerias.find(
            (lib: LibDocument) => lib.nameId === name,
          );

          // Eliminar la librería
          lenguaje.frameworks[frameworkIndex].librerias.splice(
            libreriaIndex,
            1,
          );
          const lenAny: any = lenguaje;
          proyectoActualizado = await lenAny.save();
          if (proyectoActualizado) {
            return proyectoActualizado;
          }
        }
      }

      // Buscar en frameworks
      lenguaje = await this.techReadOneService.readOne({
        filter: { 'frameworks.nameId': name },
      });
      if (lenguaje && Array.isArray(lenguaje.frameworks)) {
        const frameworkIndex = lenguaje.frameworks.findIndex(
          (fw: FwDocument) => fw.nameId === name,
        );
        const framework = lenguaje.frameworks.find(
          (fw: FwDocument) => fw.nameId === name,
        );
        if (!framework)
          throw createDomainError(
            ErrorCodes.DATABASE_FIND,
            TechFindDeleteRepo,
            'findIndex-find',
          );

        // Eliminar el framework
        lenguaje.frameworks.splice(frameworkIndex, 1);

        const lenAny: any = lenguaje;
        proyectoActualizado = await lenAny.save();
        if (proyectoActualizado) {
          return proyectoActualizado;
        }
      }

      // Buscar en lenguajes
      const lenguajeEliminado = await this.techDeleteService.delete({
        filter: { nameId: name },
      });
      if (lenguajeEliminado) {
        return lenguajeEliminado;
      }
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        TechFindDeleteRepo,
        'delete',
      );
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        TechFindDeleteRepo,
        'findAndDelete',
      );
    }
  }
}
