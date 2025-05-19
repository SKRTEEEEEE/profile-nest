import { Injectable } from "@nestjs/common";
import { TechDeleteUseCase, TechReadOneUseCase } from "../application/tech.usecase";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { FwBase } from "src/domain/entities/tech";
import { Document } from "mongoose";
import { DatabaseActionError } from "src/domain/flows/domain.error";
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
        console.log("name in deleteTech", name)
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
                // await deleteImageUC(libreria.img)
                // const res = await doDelete("Librería", name);
                // return res;
                return proyectoActualizado
            }
        }

        // Buscar en frameworks
        lenguaje = await this.techReadOneService.readOne({filter:{ "frameworks.nameId": name }});
        if (lenguaje) {
            const frameworkIndex = lenguaje.frameworks.findIndex((fw:FwDocument) => fw.nameId === name);
            const framework = lenguaje.frameworks.find((fw:FwDocument) => fw.nameId === name);

            // Eliminar imágenes de librerías asociadas al framework
            // for (const libreria of framework.librerias) {
            //     await deleteImageUC(libreria.img);
            // }

            // Eliminar el framework
            lenguaje.frameworks.splice(frameworkIndex, 1);

            const lenAny: any = lenguaje
            proyectoActualizado = await lenAny.save();
            if (proyectoActualizado) {
                //Aqui hay que hacer el doDelete, por cada lib que tubiere si las tubiere
                // await deleteImageUC(framework.img)
                // const res = await doDelete("Framework", name);
                // return res;
                return proyectoActualizado
            }
        }

        // Buscar en lenguajes
        const lenguajeEliminado = await this.techDeleteService.delete({filter:{ nameId: name }});
        if (lenguajeEliminado) {
             // Eliminar imágenes de frameworks y librerías
            //  for (const framework of lenguajeEliminado.frameworks) {
            //     await deleteImageUC(framework.img);
            //     for (const libreria of framework.librerias) {
            //         await deleteImageUC(libreria.img);
            //     }
            // }
            // await deleteImageUC(lenguajeEliminado.img)
            // const res = await doDelete("Lenguaje", name);
            // return res;
            return lenguajeEliminado
        }
        console.log(`No se encontró una tecnología con el nombre especificado: ${name}`);
        throw new DatabaseActionError("delete tech");
    } catch (error) {
        console.error('Error eliminando la tecnología:', error);
        throw new Error('Error eliminando la tecnología');
    }
}
}