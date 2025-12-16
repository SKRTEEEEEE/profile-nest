import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, ModifyResult } from 'mongoose';
import { MongooseCRUImpl } from 'src/shareds/pattern/infrastructure/implementations/cru.impl';
import {
  DBBase,
} from 'src/dynamic.types';
import { NativeLoggerService } from 'src/shareds/presentation/native-logger.service';
import { UserInterface } from '../application/user.interface';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { RoleType } from 'src/domain/entities/role.type';
import { MongooseDocument } from 'src/shareds/pattern/infrastructure/types/mongoose';
import { UserBase, UserFormS } from 'src/domain/entities/user';

@Injectable()
export class MongooseUserRepo
  extends MongooseCRUImpl<UserBase>
  implements UserInterface
{
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserBase>,
    private readonly logger: NativeLoggerService,
  ) {
    super(userModel);
  }
  async readOne(
    filter: Record<string, any>,
  ): Promise<UserBase & DBBase> {
    try {
      const doc = await this.userModel.findOne(filter);
      if (!doc)
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          MongooseUserRepo,
          'readOne',
          undefined,
          { optionalMessage: 'Error en la operación de lectura' },
        );
      return this.documentToPrimary(doc);
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseUserRepo,
        'readOne',
        undefined,
        { optionalMessage: 'Error en la operación de lectura' },
      );
    }
  }
  async update(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<UserBase & DBBase> {
    try {
      const updatedDocument: ModifyResult<UserBase & MongooseDocument> | null =
        await this.userModel.findOneAndUpdate(filter, undefined, options);
      return this.documentToPrimary(
        updatedDocument?.value as UserBase & MongooseDocument,
      ) as UserBase & DBBase;
    } catch (error) {
      this.logger.error(
        'Error al actualizar el documento',
        error instanceof Error ? error.stack : undefined,
        MongooseUserRepo.name
      );
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseUserRepo,
        'update',
        undefined,
        { optionalMessage: 'Error en la operación de actualización' },
      );
    }
  }
  async deleteById(id: string): Promise<UserBase & DBBase> {
    try {
      const result: (UserBase & DBBase) | null =
        await this.userModel.findByIdAndDelete(id);
      if (!result)
        throw createDomainError(
          ErrorCodes.DATABASE_ACTION,
          MongooseUserRepo,
          'findByIdAndDelete',
          undefined,
          { entity: 'user', optionalMessage: 'User id not found' },
        );
      return result;
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseUserRepo,
        'deleteById',
        undefined,
        { optionalMessage: 'Failed to delete the document' },
      );
    }
  }
  async read(
    filter: Partial<UserBase & DBBase>,
  ): Promise<(UserBase & DBBase)[]> {
    try {
      const docs = await this.userModel.find(filter);
      this.resArrCheck(docs);
      return docs.map((doc) => this.documentToPrimary(doc));
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseUserRepo,
        'read',
        undefined,
        { optionalMessage: 'Error en la operación de lectura' },
      );
    }
  }
  async readByAddress(address: string): Promise<
    UserFormS & {
      address: string;
      roleId: string | null;
      role: RoleType | null;
      solicitud: RoleType | null;
      isVerified: boolean;
      verifyToken?: string;
      verifyTokenExpire?: string;
      paymentId?: string;
    } & DBBase
  > {
    try {
      const res = await this.userModel.findOne({ filter: address });
      if (!res)
        throw createDomainError(
          ErrorCodes.DATABASE_FIND,
          MongooseUserRepo,
          'read',
          undefined,
          { optionalMessage: 'Error en la operación de lectura' },
        );
      return this.documentToPrimary(res);
    } catch {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseUserRepo,
        'read',
        undefined,
        { optionalMessage: 'Error en la operación de lectura' },
      );
    }
  }
}
