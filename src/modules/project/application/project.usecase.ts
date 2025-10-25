import { ProjectBase } from "src/domain/entities/project"
import { ProjectInterface } from "./project.interface"
import { DBBase } from "src/dynamic.types"
import { Inject, Injectable } from "@nestjs/common"
import { PROJECT_REPOSITORY } from "src/modules/tokens"

@Injectable()
export class ProjectPopulateUseCase {
    
  constructor(@Inject(PROJECT_REPOSITORY)private projectRepo: ProjectInterface) {}

  async execute(data: ProjectBase[]) {
    return await this.projectRepo.populate(data)
  }
}
@Injectable()
export class ProjectReadEjemploUseCase {
  constructor(@Inject(PROJECT_REPOSITORY)private projectRepo: ProjectInterface) {}

  async execute(): Promise<(ProjectBase & DBBase)[]> {
    const projects = await this.projectRepo.readEjemplo()

    // Reglas de negocio opcionales
    if (projects.length === 0) {
      console.warn("No se encontraron proyectos en la DB")
    }

    return projects
  }
}

@Injectable()
export class ProjectReadByIdUseCase {
  constructor(@Inject(PROJECT_REPOSITORY)private projectRepo: ProjectInterface) {}

  async execute(id: string): Promise<(ProjectBase & DBBase) | null> {
    const project = await this.projectRepo.readById(id)

    // Reglas de negocio opcionales
    if (!project) {
      console.warn(`Proyecto con id ${id} no encontrado en la DB`)
    }

    return project
  }
}
