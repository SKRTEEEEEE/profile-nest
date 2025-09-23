import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, ModifyResult } from "mongoose";
import { MongooseCRUImpl } from "src/shareds/pattern/infrastructure/implementations/cru.impl";
import { MongooseBase, MongooseDocument } from "src/shareds/pattern/infrastructure/types/mongoose";
import { UserInterface } from "../application/user.interface";
import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";
import { RoleType } from "src/domain/entities/role.type";


@Injectable()
export class MongooseUserRepo
    extends MongooseCRUImpl<UserBase>
    implements UserInterface<MongooseBase> {
    constructor(
        @InjectModel("User") private readonly userModel:
            Model<UserBase & MongooseBase & Document>
    ) {
        super(
            userModel,
        )
    }
    async readOne(filter: Record<string, any>): EntitieRes<UserBase, MongooseBase> {
        try {
            const doc = await this.userModel.findOne(filter)
            if(!doc)throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseUserRepo, 'readOne', undefined, { optionalMessage: 'Error en la operación de lectura' })
            return doc 
        } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseUserRepo, 'readOne', undefined, { optionalMessage: 'Error en la operación de lectura' })
        }
    }
    async update(filter: Record<string, any>, options: Record<string, any>): EntitieRes<UserBase, MongooseBase> {
        try {
            const updatedDocument: ModifyResult<UserBase & MongooseDocument> | null = await this.userModel.findOneAndUpdate(filter, undefined, options)
            return this.documentToPrimary(updatedDocument?.value as UserBase & MongooseDocument) as UserBase & MongooseBase
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseUserRepo, 'update', undefined, { optionalMessage: 'Error en la operación de actualización' });
        }
    }
    async deleteById(id: string): DeleteByIdRes<UserBase, MongooseBase> {
        try {
            const result: UserBase & MongooseBase | null = await this.userModel.findByIdAndDelete(id);
            if(!result)throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseUserRepo, 'findByIdAndDelete', undefined, { entity: 'user', optionalMessage: 'User id not found' })
            return result;
          } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseUserRepo, 'deleteById', undefined, { optionalMessage: 'Failed to delete the document' });
          }
    }
    async read(filter: Partial<UserBase & MongooseBase>): EntitieArrayRes<UserBase, MongooseBase> {
        try {
            const docs = await this.userModel.find(filter);
            this.resArrCheck(docs)
            return docs.map(doc => this.documentToPrimary(doc))
        } catch (error) {
            throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseUserRepo, 'read', undefined, { optionalMessage: 'Error en la operación de lectura' });
        }
    }
    async readByAddress(address: string): Promise<UserFormS & { address: string; roleId: string | null; role: RoleType | null; solicitud: RoleType | null; isVerified: boolean; verifyToken?: string; verifyTokenExpire?: string; paymentId?: string; } & MongooseBase> {
        try {
            const res = await this.userModel.findOne({filter:address})
            if(!res) throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseUserRepo, 'read', undefined, { optionalMessage: 'Error en la operación de lectura' });
            return res
        }catch {
           throw createDomainError(ErrorCodes.DATABASE_FIND, MongooseUserRepo, 'read', undefined, { optionalMessage: 'Error en la operación de lectura' });
        }
    }
}
