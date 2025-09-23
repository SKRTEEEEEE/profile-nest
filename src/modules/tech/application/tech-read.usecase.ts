import { Inject, Injectable } from '@nestjs/common';
import {
  FullTechData,
  LengBase,
  ReadAllFlattenTechsRes,
} from 'src/domain/entities/tech';
import { TechRepository } from './tech.interface';
import { TECH_REPOSITORY } from 'src/modules/tokens';

type BadgeAndValue = {
  badge: string;
  value: string;
};
// Service for reading Tech entities
@Injectable()
export class TechReadUseCase<TDB> {
  constructor(
    @Inject(TECH_REPOSITORY)
    private readonly techRepository: TechRepository<TDB>,
  ) {}

  async read(filter?: Partial<LengBase & TDB>): Promise<(LengBase & TDB)[]> {
    return await this.techRepository.read(filter);
  }
  // Este tiene logica ponerlo aqui porque es una excision de read
  async readAllC(): Promise<ReadAllFlattenTechsRes<TDB>> {
    const proyectosDB = await this.techRepository.read({});
    const dispoLeng = proyectosDB?.map((lenguaje: { nameId: string }) => ({
      name: lenguaje.nameId,
    }));
    const dispoFw = proyectosDB?.flatMap((lenguaje) => {
      if (
        Array.isArray(lenguaje.frameworks) &&
        lenguaje.frameworks.length > 0
      ) {
        return lenguaje.frameworks.map((fw: { nameId: string }) => ({
          name: fw.nameId,
        }));
      }
      return [];
    });
    return {
      techs: proyectosDB,
      flattenTechs: this.flattenTechs(proyectosDB),
      dispoFw,
      dispoLeng,
    };
  }
  async readAll(): Promise<(LengBase & TDB)[]> {
    return await this.techRepository.read({});
  }
  async readAllFlatten(): Promise<FullTechData[]> {
    const res = await this.techRepository.read({});
    return this.flattenTechs(res);
  }
  async readAllCat(): Promise<
    Omit<ReadAllFlattenTechsRes<TDB>, 'techs' | 'flattenTechs'>
  > {
    const proyectosDB = await this.techRepository.read({});
    const dispoLeng = proyectosDB?.map((lenguaje: { nameId: string }) => ({
      name: lenguaje.nameId,
    }));
    const dispoFw = proyectosDB?.flatMap((lenguaje) => {
      if (
        Array.isArray(lenguaje.frameworks) &&
        lenguaje.frameworks.length > 0
      ) {
        return lenguaje.frameworks.map((fw: { nameId: string }) => ({
          name: fw.nameId,
        }));
      }
      return [];
    });
    return { dispoFw, dispoLeng };
  }
  private flattenTechs = (proyectos: (LengBase & TDB)[]): FullTechData[] => {
    const flattenedArray: FullTechData[] = [];

    proyectos.forEach((proyecto) => {
      // Proyecto principal
      flattenedArray.push({
        nameId: proyecto.nameId,
        nameBadge: proyecto.nameBadge,
        afinidad: proyecto.afinidad,
        valueAfin: this.getColorByRange(proyecto.afinidad).value,
        experiencia: proyecto.experiencia,
        valueExp: this.getColorByRange(proyecto.experiencia).value,
        color: proyecto.color,
        isFw: undefined,
        isLib: undefined,
        preferencia: proyecto.preferencia,
        img: proyecto.img,
        web: proyecto.web,
        desc: proyecto.desc,
        usoGithub: proyecto.usoGithub,
        valueUso: this.getGithubUsoByRange(proyecto.usoGithub).value,
      });

      // Frameworks
      proyecto.frameworks?.forEach((framework) => {
        flattenedArray.push({
          nameId: framework.nameId,
          nameBadge: framework.nameBadge,
          afinidad: framework.afinidad,
          valueAfin: this.getColorByRange(framework.afinidad).value,
          experiencia: framework.experiencia,
          valueExp: this.getColorByRange(framework.experiencia).value,
          color: framework.color,
          isFw: proyecto.nameId,
          isLib: undefined,
          preferencia: framework.preferencia,
          img: framework.img,
          web: framework.web,
          desc: framework.desc,
          usoGithub: framework.usoGithub,
          valueUso: this.getGithubUsoByRange(framework.usoGithub).value,
        });

        // Librerías
        framework.librerias?.forEach((libreria) => {
          flattenedArray.push({
            nameId: libreria.nameId,
            nameBadge: libreria.nameBadge,
            afinidad: libreria.afinidad,
            valueAfin: this.getColorByRange(libreria.afinidad).value,
            experiencia: libreria.experiencia,
            valueExp: this.getColorByRange(libreria.experiencia).value,
            color: libreria.color,
            isFw: proyecto.nameId,
            isLib: framework.nameId,
            preferencia: libreria.preferencia,
            img: libreria.img,
            web: libreria.web,
            desc: libreria.desc,
            usoGithub: libreria.usoGithub,
            valueUso: this.getGithubUsoByRange(libreria.usoGithub).value,
          });
        });
      });
    });

    return flattenedArray;
  };
  private getGithubUsoByRange(numValue: number): BadgeAndValue {
    let badge: string;
    let value: string;
    switch (true) {
      case numValue === 0:
        badge = '%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98';
        value = 'Ninguno';
        break;
      case numValue > 0 && numValue <= 0.05:
        badge = '%F0%9F%9F%A1%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98';
        value = 'Ínfimo';
        break;
      case numValue > 0.05 && numValue <= 0.2:
        badge = '%F0%9F%9F%A1%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98';
        value = 'Minúsculo';
        break;
      case numValue > 0.2 && numValue <= 0.5:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98';
        value = 'Bajo';
        break;
      case numValue > 0.5 && numValue <= 1.0:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%94%98%F0%9F%94%98%F0%9F%94%98';
        value = 'Reducido';
        break;
      case numValue > 1.0 && numValue <= 1.5:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%94%98%F0%9F%94%98';
        value = 'Menor';
        break;
      case numValue > 1.5 && numValue <= 2.5:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%94%98%F0%9F%94%98';
        value = 'Moderado';
        break;
      case numValue > 2.5 && numValue <= 4.0:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%94%98';
        value = 'Notable';
        break;
      case numValue > 4.0 && numValue <= 6.0:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%94%98';
        value = 'Alto';
        break;
      case numValue > 6.0 && numValue <= 9.0:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1';
        value = 'Elevado';
        break;
      case numValue > 9.0 && numValue <= 14.0:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1';
        value = 'Superior';
        break;
      case numValue > 14.0:
        badge = '%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1%F0%9F%9F%A1';
        value = 'Dominante';
        break;
      default:
        badge = '';
        value = '';
        break;
    }

    return { badge, value };
  }
  private getColorByRange(numValue: number): BadgeAndValue {
    let badge: string;
    let value: string;
    if (numValue > 80) {
      badge = 'darkgreen';
      value = 'max'; // darkgreen para valores >= 80
    } else if (numValue > 60) {
      badge = 'brightgreen';
      value = 'high'; // brightgreen para valores >= 60 y < 80
    } else if (numValue > 40) {
      badge = 'blue';
      value = 'neut'; // "moderada" para valores >= 40 y < 60
    } else if (numValue >= 20) {
      badge = 'yellow';
      value = 'low'; // "baja" para valores >= 20 y < 40
    } else {
      badge = 'red';
      value = 'min'; // "minima" para valores < 20
    }
    return { badge, value };
  }
}
