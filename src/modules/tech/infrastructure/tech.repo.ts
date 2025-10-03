import { Injectable } from '@nestjs/common';
import {  FwBase,  LengBase, TechBase, TechForm } from 'src/domain/entities/tech';
import {  Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUImpl } from 'src/shareds/pattern/infrastructure/implementations/cru.impl';

import {
  DBBase,
} from 'src/dynamic.types';;
import { Fw,  Leng,  TechRepository } from '../application/tech.interface';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { MongooseDocument } from 'src/shareds/pattern/infrastructure/types/mongoose';
import { DeleteProps } from 'src/shareds/pattern/application/interfaces/delete';



@Injectable()
export class MongooseTechRepo
  extends MongooseCRUImpl<LengBase>
  implements TechRepository
{
  constructor(
    @InjectModel('Lenguaje')
    private readonly lengModel: Model<LengBase>,
  ) {
    super(lengModel);
  }
  async readOne(filter?: Record<string, any>) {
    try {
      const res = await this.lengModel.findOne(filter);
      if (!res)
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          MongooseTechRepo,
          'readOne',
        );
      return this.documentToPrimary(res) as Leng;
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseTechRepo,
        'readOne',
      );
    }
  }
  async read(
    filter?: Partial<LengBase & DBBase>,
  ): Promise<Leng[]> {
    try {
      let docs;
      if(!filter){docs = await this.lengModel.find({}) }else{       docs = await this.lengModel.find(filter);
}
      this.resArrCheck(docs);
      return this.techToPrim(docs)
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseTechRepo,
        'read',
        undefined,
        { optionalMessage: 'Error en la operación de lectura' },
      );
    }
  }
  private techToPrim = (proyectos: (LengBase & MongooseDocument)[]): Leng[] => {
    const flattenedArray: Leng[] = [];

    proyectos.forEach((proyecto) => {
      // Proyecto principal
      const { _id, createdAt, updatedAt, frameworks, ...rest } = proyecto.toObject();

      const leng: Leng = {
        id: _id.toString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        ...rest,
        frameworks: frameworks ? frameworks.map(fw => {
          const { _id, createdAt, updatedAt, librerias, ...restFw } = fw;
          const fwBase: Fw = {
            id: _id.toString(),
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
            ...restFw,
            librerias: librerias ? librerias.map(lib => {
              const { _id, createdAt, updatedAt, ...restLib } = lib;
              return {
                id: _id.toString(),
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
                ...restLib,
              }
            }) : undefined
          }
          return fwBase
        }) : undefined
      };
      flattenedArray.push(leng);
    });

    return flattenedArray;
  };
  async updateByNameId(
    nameId: string,
    updateData: Partial<LengBase>,
  ): Promise<
    (TechBase & { frameworks?: FwBase[] } & DBBase) | undefined | null
  > {
    try {
      return this.lengModel.findOneAndUpdate({
        filter: { nameId },
        updateData,
        options: { new: true },
      });
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION, // O el código que uses para BD
        this.constructor,
        'updateByNameId',
        'tryAgainOrContact',
        {
          nameId,
          operation: 'findOneAndUpdate',
          model: 'lengModel',
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }
  async updateByForm(
    updateData: Partial<TechForm>,
  ): Promise<LengBase & DBBase> {
    try {
      let proyectoActualizado;
      if ('fwTo' in updateData) {
        // Actualizar librería
        proyectoActualizado = await this.lengModel.findOneAndUpdate({
          filter: { 'frameworks.librerias.nameId': updateData.nameId },
          update: {
            $set: {
              // "frameworks.$[fw].librerias.$[lib].color": updateData.color,

              'frameworks.$[fw].librerias.$[lib].web': updateData.web,
              'frameworks.$[fw].librerias.$[lib].afinidad': updateData.afinidad,
              'frameworks.$[fw].librerias.$[lib].experiencia':
                updateData.experiencia,
              'frameworks.$[fw].librerias.$[lib].img': updateData.img,
              'frameworks.$[fw].librerias.$[lib].desc': updateData.desc,
            },
          },
          options: {
            arrayFilters: [
              { 'fw.librerias.nameId': updateData.nameId },
              { 'lib.nameId': updateData.nameId },
            ],
            new: true,
          },
        });
      } else if ('lengTo' in updateData) {
        // Actualizar framework
        proyectoActualizado = await this.lengModel.findOneAndUpdate({
          filter: { 'frameworks.nameId': updateData.nameId },
          update: {
            $set: {
              'frameworks.$.web': updateData.web,
              'frameworks.$.afinidad': updateData.afinidad,
              // "frameworks.$.color": updateData.color,
              'frameworks.$.experiencia': updateData.experiencia,
              'frameworks.$.img': updateData.img,
              'frameworks.$.desc': updateData.desc,
            },
          },
          options: { new: true },
        });
      } else {
        // Actualizar lenguaje
        proyectoActualizado = await this.lengModel.findOneAndUpdate({
          filter: { nameId: updateData.nameId },
          update: updateData,
          options: { new: true },
        });
      }
      return proyectoActualizado;
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseTechRepo,
        'update',
        undefined,
        { optionalMessage: 'Error en la operación de actualización' },
      );
    }
  }
  async delete(
    filter: DeleteProps<LengBase>,
  ): Promise<LengBase & DBBase> {
    try {
      const res = await this.lengModel.findOneAndDelete(filter.filter);
      if (!res)
        throw createDomainError(
          ErrorCodes.DATABASE_ACTION,
          MongooseTechRepo,
          'delete',
        );
      return this.documentToPrimary(res);
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseTechRepo,
        'delete',
        undefined,
        { optionalMessage: 'Failed to delete the document' },
      );
    }
  }
}
