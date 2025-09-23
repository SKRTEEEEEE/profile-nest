import { Injectable } from '@nestjs/common';
import { FullTechData, LengBase, TechBase } from 'src/domain/entities/tech';
import { TechReadUseCase } from 'src/modules/tech/application/tech-read.usecase';
import { MongooseBase } from 'src/shareds/pattern/infrastructure/types/mongoose';
import { OctokitRepo } from 'src/shareds/octokit/infrastructure/octokit.service';

// ⚠️ Hay que arreglar esto ⬇️⬇️
const baseOptions = {
  owner: 'SKRTEEEEEE',
  repo: 'markdowns',
  ref: 'main',
  // ref: "profile-page"
};
const path = { md: 'about/techs.md', json: 'sys/techs.json' };

// Banner de tecnologías para el README - Esta parte HAY QUE devolverla en un endpoint para cuando la cambie se cambie en todos los README
const techsHeaderBanner = `<img src="https://skillicons.dev/icons?i=solidity,ipfs,git,github,obsidian,md,html,css,styledcomponents,tailwind,threejs,react,js,ts,prisma,sqlite,mongodb,mysql,nextjs,nodejs,express,py,php,c,cpp,sentry,redux,firebase,vercel,bash,powershell,npm,vscode,notion,ableton,windows&perline=18" />`;
export enum ActualizarGithubType {
  'md',
  'json',
  'all',
}
type ActualizarGithubTechsProps = {
  type: ActualizarGithubType;
  create?: {
    base: PreTechBase;
    oldTechs: (LengBase & MongooseBase)[];
  };
  // techs: ReadAllFlattenTechsRes<MongooseBase>["techs"],
  // flattenTechs: ReadAllFlattenTechsRes<MongooseBase>["flattenTechs"]
};
type TechJsonData = {
  name: string;
  afinidad: number;
  value: string;
  experiencia: number;
  valueexp: string;
  usogithub: number;
  valueuso: string;
};
type GetLinksResp = {
  base: string;
  af: string;
  afNum: string;
  exp: string;
  expNum: string;
  github: string;
  githubNum: string;
};

@Injectable()
export class TechOctokitActualizarGithubRepo {
  constructor(
    private readonly techReadService: TechReadUseCase<MongooseBase>,
    private readonly octokit: OctokitRepo,
  ) {}
  async actualizar(props: {
    type: ActualizarGithubType;
    create?: {
      base: PreTechBase;
      oldTechs: (LengBase & MongooseBase)[];
    };
  }) {
    const { flattenTechs, techs } = await this.techReadService.readAllC();
    if (props.create !== undefined) {
      try {
        await this.actualizarMd({ create: props.create });
        await this.actualizarJson(flattenTechs);
      } catch (error) {
        console.error('Error at actualizarGithubTechs, create variant');
      }
    } else {
      try {
        if (props.type === ActualizarGithubType.all) {
          await this.actualizarMd({ proyectosDB: techs });
          await this.actualizarJson(flattenTechs);
        }
        if (props.type === ActualizarGithubType.json) {
          await this.actualizarJson(flattenTechs);
        }
      } catch (error) {
        console.error('Error at actualizarGithubTechs, not-create variant');
      }
    }
  }
  private createBaseBadge(data: PreTechBase) {
    const { nameId, web } = data;
    // const color = tech.color.slice(1)
    const baseLink = this.getTechsLinks(data).base;
    return `[![${nameId}](${baseLink})](${web})`;
  }
  private async actualizarMd(props: {
    create?: ActualizarGithubTechsProps['create'];
    proyectosDB?: (LengBase & MongooseBase)[];
  }) {
    const { create, proyectosDB } = props;
    try {
      let proyectos;
      if (create === undefined) {
        proyectos = proyectosDB;
      } else {
        proyectos = create.oldTechs;
      }

      // // Si hay un nuevo proyecto, filtrar proyectosDB para eliminar coincidencias
      // if (!create) {
      //     proyectosFiltrados = proyectosDB.filter(proyecto =>
      //         proyecto.nameId.toLowerCase() !== create.nameId.toLowerCase()
      //     );
      // }
      let newMdContent = `# Tecnologías y Lenguajes de Programación\n_Documentación de lenguajes, tecnologías (frameworks, librerías...) de programación que utilizo._\n\n
<p align="center">
<a href="#">
${techsHeaderBanner}
</a>
</p>\n\n\n***\n\n\n`;
      if (create) {
        newMdContent += this.createBadgeTech(create.base, true);
      }

      proyectos
        ?.sort((a, b) => a.preferencia - b.preferencia)
        .forEach((proyecto) => {
          newMdContent += `\n\n>- ## ${this.createBadgeTech(proyecto)}`;
          if (proyecto.frameworks) {
            proyecto.frameworks.sort((a, b) => a.preferencia - b.preferencia);
            proyecto.frameworks.forEach((framework) => {
              newMdContent += `\n\n> ### ${this.createBadgeTech(framework)}`;
              if (framework.librerias) {
                framework.librerias
                  .sort((a, b) => a.preferencia - b.preferencia)
                  .forEach((libreria) => {
                    newMdContent += `\n> - #### ${this.createBadgeTech(libreria)}`;
                  });
              }
            });
          }
        });

      await this.octokit.updateFileContent(path.md, baseOptions, {
        message: 'Actualizar archivo .md',
        content: newMdContent,
      });
      console.info('Archivo Markdown actualizado');
    } catch (error) {
      console.error('Error actualizando el archivo .md:', error);
    }
  }

  private async actualizarJson(flattenTechs: FullTechData[]) {
    // -> utiliza flattenTechs
    const t = {
      max: 'Máxima',
      high: 'Alta',
      neut: 'Moderada',
      low: 'Baja',
      min: 'Mínima',
    };
    // const jsonSha = await fetchFileSha(path.json);
    // if (!jsonSha) {
    //     console.error("El archivo .json no se encuentra en el repositorio");
    //     return;
    // }

    const newJsonData = flattenTechs.reduce<{ [key: string]: TechJsonData }>(
      (acc, proyecto) => {
        const lenguajeName = proyecto.nameBadge; // Nombre del lenguaje como clave
        // Crear el objeto con los datos correspondientes
        const languageData: TechJsonData = {
          name: proyecto.nameId,
          afinidad: proyecto.afinidad,
          value: t[proyecto.valueAfin],
          // value: proyecto.value,
          experiencia: proyecto.experiencia,
          valueexp: t[proyecto.valueExp],
          // valueexp: proyecto.valueexp,
          // usogithub: await getGithubPercentage(proyecto.nameId),
          usogithub: proyecto.usoGithub,
          valueuso: proyecto.valueUso,
        };

        // Asigna el objeto al acumulador utilizando el nombre del lenguaje como clave
        acc[lenguajeName] = languageData;

        return acc;
      },
      {},
    );

    await this.octokit.updateFileContent(path.json, baseOptions, {
      message: 'Actualizar archivo .json',
      content: JSON.stringify(newJsonData, null, 2),
    });
    console.info('Archivo Json actualizado');
  }

  private getContrastColor(hexColor: string): string {
    // Remover el # si existe
    // const hex = hexColor.replace('#', '');

    // Convertir a RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Calcular la luminancia relativa
    // Fórmula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Si la luminancia es mayor a 0.5, el color es considerado "claro"
    // y necesitamos texto negro. En caso contrario, necesitamos texto blanco.
    return luminance > 0.5 ? 'black' : 'white';
  }

  private createBadgeTech(tech: PreTechBase, newTech?: true) {
    const { af, afNum, exp, expNum, github, githubNum } = this.getTechsLinks({
      nameId: tech.nameId,
      color: tech.color,
      nameBadge: tech.nameBadge,
      web: tech.web,
    });
    const baseBadge = this.createBaseBadge({
      nameId: tech.nameId,
      color: tech.color,
      nameBadge: tech.nameBadge,
      web: tech.web,
    });
    if (newTech === true) {
      return `>- ## ${baseBadge}\n>![Afinidad](${af})![Afinidad %](${afNum})\n![Experiencia](${exp})![Experiencia %](${expNum})\n![Uso En Github](${github})![Uso en Github %](${githubNum})\n>\n>![New Badge](https://img.shields.io/badge/%C2%A1_novedad_%F0%9F%91%8D_!-NEW_%F0%9F%93%A5_%F0%9F%97%92%EF%B8%8F-blue?style=social)`;
    } else {
      return `${baseBadge}\n>![Afinidad](${af})![Afinidad %](${afNum})\n![Experiencia](${exp})![Experiencia %](${expNum})\n![Uso En Github](${github})![Uso en Github %](${githubNum})`;
    }
  }

  private getTechsLinks({
    nameId,
    nameBadge,
    color,
  }: PreTechBase): GetLinksResp {
    const { repo, ref, owner } = baseOptions;
    const logoColor = this.getContrastColor(color);
    return {
      base: `https://img.shields.io/badge/-${(nameId = nameId.replace(/[\s-]+/g, '%20'))}-${color}?style=for-the-badge&logo=${nameBadge}&logoColor=${logoColor}`,
      af: `https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.json}&query=$.${nameBadge}.value&label=%F0%9F%92%97%20Afinidad&color=${color}&style=flat&logo=${nameBadge}`,
      afNum: `https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.json}&query=$.${nameBadge}.afinidad&color=${color}&style=flat&label=%20&suffix=%25`,
      exp: `https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.json}&query=$.${nameBadge}.valueexp&label=%F0%9F%8F%85%20Experiencia&color=${color}&style=flat&logo=${nameBadge}`,
      expNum: `https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.json}&query=$.${nameBadge}.experiencia&color=${color}&style=flat&label=%20&suffix=%25`,
      github: `https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.json}&query=$.${nameBadge}.valueuso&label=%F0%9F%98%BB%20Uso%20en%20github&color=${color}&style=flat&logo=${nameBadge}`,
      githubNum: `https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.json}&query=$.${nameBadge}.usogithub&color=${color}&style=flat&label=%20&suffix=%25`,
    };
  }
}
