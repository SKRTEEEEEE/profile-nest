import { Injectable } from "@nestjs/common";
import { FwBase, LengBase, TechBase, TechForm } from "src/domain/entities/tech";
import { Model, ModifyResult } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MongooseCRUImpl } from "src/shareds/pattern/infrastructure/implementations/cru.impl";

import { MongooseBase, MongooseDocument } from "src/shareds/pattern/infrastructure/types/mongoose";
import { TechRepository } from "../application/tech.interface";
import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";

@Injectable()
export class MongooseTechRepo
    extends MongooseCRUImpl<LengBase>
    implements TechRepository<MongooseBase> {
    constructor(
        @InjectModel("Lenguaje") private readonly lengModel: Model<LengBase & MongooseBase & Document>) {
        super(
            lengModel,

        )
    }
    async readOne(filter?: Record<string, any>) {
        try {
            const res = await this.lengModel.findOne(filter)
            if (!res) throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseTechRepo, "readOne")
            return res
        } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseTechRepo, "readOne")
        }
    }
    async read(filter: Partial<LengBase & MongooseBase>): EntitieArrayRes<LengBase, MongooseBase> {
        try {

            const docs = await this.lengModel.find(filter);
            this.resArrCheck(docs)
            return docs.map(doc => this.documentToPrimary(doc))
        } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseTechRepo, 'read', undefined, { optionalMessage: 'Error en la operación de lectura' });
        }
    }
    async updateByNameId(nameId: string, updateData: Partial<LengBase>): Promise<(TechBase & { frameworks?: FwBase[]; } & MongooseBase) | undefined | null> {
        try {
            return this.lengModel.findOneAndUpdate({filter:{nameId}, updateData, options:{new: true}})

        } catch (error) {
            
        }
    }
    async updateByForm(updateData: Partial<TechForm>): EntitieRes<LengBase, MongooseBase> {
        try {
            let proyectoActualizado;
            if ('fwTo' in updateData) {
                // Actualizar librería
                proyectoActualizado = await this.lengModel.findOneAndUpdate(
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
                proyectoActualizado = await this.lengModel.findOneAndUpdate(
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
                proyectoActualizado = await this.lengModel.findOneAndUpdate(
                    {filter:{ nameId: updateData.nameId },
                    update:updateData,
                    options:{ new: true }}
                );
            }
            return proyectoActualizado
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseTechRepo, 'update', undefined, { optionalMessage: 'Error en la operación de actualización' });
        }
    }
    async delete(filter: Record<string, any>): EntitieRes<LengBase, MongooseBase> {
        try {
            const res = await this.lengModel.findOneAndDelete(filter)
            if (!res) throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseTechRepo, "delete")
            return res
        } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseTechRepo, 'delete', undefined, { optionalMessage: 'Failed to delete the document' });
        }
    }
}