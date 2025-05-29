import { Injectable } from "@nestjs/common";
import { TechUpdateUseCase } from "../../application/tech.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { ActualizarGithubType, TechOctokitActualizarGithubRepo } from "./actualizar.repo";
import { TechForm } from "src/domain/entities/tech";

@Injectable()
export class TechOctokitUpdateRepo {
    constructor(
        private readonly techUpdateService: TechUpdateUseCase<MongooseBase>,
        private readonly techOctokitActualizarGithubRepo: TechOctokitActualizarGithubRepo
    ){}
    async update(updateData: Partial<TechForm>) {
    try {
        let proyectoActualizado;
        if ('fwTo' in updateData) {
            // Actualizar librería
            proyectoActualizado = await this.techUpdateService.update(
                {filter:{ "frameworks.librerias.nameId": updateData.nameId },
                update:{
                    $set: {
                        // "frameworks.$[fw].librerias.$[lib].color": updateData.color,
                        
                        "frameworks.$[fw].librerias.$[lib].web": updateData.web,
                        "frameworks.$[fw].librerias.$[lib].afinidad": updateData.afinidad,
                        "frameworks.$[fw].librerias.$[lib].experiencia": updateData.experiencia,
                        "frameworks.$[fw].librerias.$[lib].img": updateData.img,
                        "frameworks.$[fw].librerias.$[lib].desc": updateData.desc,
                    }
                },
                options:{
                    arrayFilters: [
                        { "fw.librerias.nameId": updateData.nameId },
                        { "lib.nameId": updateData.nameId }
                    ],
                    new: true
                }}
            );
        } else if ('lengTo' in updateData) {
            // Actualizar framework
            proyectoActualizado = await this.techUpdateService.update(
              {filter:{ "frameworks.nameId": updateData.nameId },
                update:{
                    $set: {
                        "frameworks.$.web": updateData.web,
                        "frameworks.$.afinidad": updateData.afinidad,
                        // "frameworks.$.color": updateData.color,
                        "frameworks.$.experiencia": updateData.experiencia,
                        "frameworks.$.img": updateData.img,
                        "frameworks.$.desc": updateData.desc
                    }
                },
                options:{ new: true }}
            );
        } else {
            // Actualizar lenguaje
            proyectoActualizado = await this.techUpdateService.update(
                {filter:{ nameId: updateData.nameId },
                update:updateData,
                options:{ new: true }}
            );
        }

        if (!proyectoActualizado) {
            return `No se encontró un proyecto llamado ${updateData.nameId}.`;
        }
        await this.techOctokitActualizarGithubRepo.actualizar({type: ActualizarGithubType.json});
        return `El proyecto ${updateData.nameId} ha sido actualizado correctamente.`
    } catch (error) {
        console.error('Error actualizando el proyecto:', error);
        return 'Ocurrió un problema al intentar actualizar el proyecto. Por favor, intente de nuevo más tarde.';
    }
    }
}