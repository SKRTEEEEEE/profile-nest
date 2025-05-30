import { Injectable } from "@nestjs/common";
import { TechDeleteUseCase, TechReadOneUseCase } from "../application/tech.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { FwBase } from "src/domain/entities/tech";
import { Document } from "mongoose";
import { DatabaseActionError, DatabaseFindError } from "src/domain/flows/domain.error";
import { FwDocument, LibDocument } from "./tech.schema";
// type LibDocument = LibBase & Document
// type FwDocument = FwBase & Document

// Lo suyo seria tener este archivo en el mismo delete de tech.repo.ts

@Injectable()
export class TechFindDeleteRepo {
    constructor(
        private readonly techReadOneService: TechReadOneUseCase<MongooseBase>,
        private readonly techDeleteService: TechDeleteUseCase<MongooseBase>
    ){}
    async findAndDelete(name: string) {
        
    try {
        let proyectoActualizado = null;

        // Buscar en librerías
        let lenguaje = await this.techReadOneService.readOne({filter:{ "frameworks.librerias.nameId": name }});
        if (lenguaje) {
            const frameworkIndex = lenguaje.frameworks.findIndex((fw:FwBase & Document) => fw.librerias?.some((lib:LibDocument) => lib.nameId === name));
            const libreriaIndex = lenguaje.frameworks[frameworkIndex].librerias.findIndex((lib:LibDocument) => lib.nameId === name);
            const libreria = lenguaje.frameworks[frameworkIndex].librerias.find((lib:LibDocument) => lib.nameId === name);

            // Eliminar la librería
            lenguaje.frameworks[frameworkIndex].librerias.splice(libreriaIndex, 1);
            const lenAny: any = lenguaje
            proyectoActualizado = await lenAny.save();
            if (proyectoActualizado) {
                return proyectoActualizado
            }
        }

        // Buscar en frameworks
        lenguaje = await this.techReadOneService.readOne({filter:{ "frameworks.nameId": name }});
        if (lenguaje) {
            const frameworkIndex = lenguaje.frameworks.findIndex((fw:FwDocument) => fw.nameId === name);
            const framework = lenguaje.frameworks.find((fw:FwDocument) => fw.nameId === name);
            if(!framework)throw new DatabaseFindError("findIndex-find",TechFindDeleteRepo)

            // Eliminar el framework
            lenguaje.frameworks.splice(frameworkIndex, 1);

            const lenAny: any = lenguaje
            proyectoActualizado = await lenAny.save();
            if (proyectoActualizado) {
                return proyectoActualizado
            }
        }

        // Buscar en lenguajes
        const lenguajeEliminado = await this.techDeleteService.delete({filter:{ nameId: name }});
        if (lenguajeEliminado) {
            return lenguajeEliminado
        }
        throw new DatabaseActionError("delete", TechFindDeleteRepo);
    } catch (error) {
        throw new DatabaseActionError('findAndDelete', TechFindDeleteRepo);
    }
}
}