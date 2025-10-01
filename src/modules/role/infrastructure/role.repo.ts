import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RoleBase } from 'src/domain/entities/role';
import { MongooseCRUImpl } from 'src/shareds/pattern/infrastructure/implementations/cru.impl';
import { RoleInterface } from '../application/role.interface';
import { DBBase } from 'src/dynamic.types';;
import { ErrorCodes } from 'src/domain/flows/error.type';
import { createDomainError } from 'src/domain/flows/error.registry';
import { DeleteProps } from '@/shareds/pattern/application/interfaces/delete';

@Injectable()
export class MongooseRoleRepo
  extends MongooseCRUImpl<RoleBase>
  implements RoleInterface
{
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<RoleBase>,
  ) {
    super(roleModel);
  }

  async read(
    filter?: Record<string, any>,
  ): Promise<(RoleBase & DBBase)[]> {
    const docs = await this.roleModel.find(filter ? { filter } : {});
    return docs.map((doc) => this.documentToPrimary(doc));
  }

  async isAdmin(address: string): Promise<boolean> {
    const role = await this.roleModel.findOne({ address, name: 'admin' });
    return !!role;
  }

  async deleteById(
    id: string,
  ): Promise<RoleBase & DBBase> {
    const deleted = await this.roleModel.findByIdAndDelete(id);
    if (!deleted)
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseRoleRepo,
        'findByIdAndDelete',
        undefined,
        { entity: 'user', optionalMessage: 'User id not found' },
      );
    return this.documentToPrimary(deleted);
  }

  async delete(
    props: DeleteProps<RoleBase>,
  ): Promise<(RoleBase & DBBase)[]> {
    try {
      const res = await this.roleModel.findOneAndDelete(props.filter);
      if (!res)
        throw createDomainError(
          ErrorCodes.DATABASE_ACTION,
          MongooseRoleRepo,
          'delete',
        );
      return [this.documentToPrimary(res) as RoleBase & DBBase];
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        MongooseRoleRepo,
        'delete',
        undefined,
        { optionalMessage: 'Failed to delete the document' },
      );
    }
  }
}
