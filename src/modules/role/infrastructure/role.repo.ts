import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

import { RoleBase } from "src/domain/entities/role";
import { MongooseCRUImpl } from "src/shareds/pattern/infrastructure/implementations/cru.impl";
import { RoleInterface } from "../application/role.interface";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types/mongoose";
import { ErrorCodes } from "src/domain/flows/error.type";
import { createDomainError } from "src/domain/flows/error.registry";


@Injectable()
export class MongooseRoleRepo 
  extends MongooseCRUImpl<RoleBase>
  implements RoleInterface 
{
  constructor(
    @InjectModel("Role") private readonly roleModel: Model<RoleBase & Document>
  ) {
    super(roleModel);
  }

  // ✔ Arreglado: antes estabas metiendo el filtro dentro de otro objeto {filter}
  async read(filter?: Record<string, any>): EntitieArrayRes<RoleBase, MongooseBase> {
    const docs = await this.roleModel.find(filter ?{filter} : {});
    return docs.map(doc => this.documentToPrimary(doc));
  }

  // ✔ Comprueba si la dirección tiene un rol de admin
  async isAdmin(address: string): Promise<boolean> {
    const role = await this.roleModel.findOne({ address, name: "admin" });
    return !!role;
  }

  // ✔ Borra un documento por id y devuelve el documento borrado convertido
  async deleteById(id: DeleteByIdProps<MongooseBase>): DeleteByIdRes<RoleBase, MongooseBase> {
    const deleted = await this.roleModel.findByIdAndDelete(id);
    if (!deleted) throw  createDomainError(ErrorCodes.DATABASE_ACTION, MongooseRoleRepo, 'findByIdAndDelete', undefined, { entity: 'user', optionalMessage: 'User id not found' });
    return this.documentToPrimary(deleted);
  }

  // ✔ Borra por condiciones (ejemplo: por address o por cualquier campo del Role)
  async delete(props: DeleteProps<RoleBase, MongooseBase>): DeleteRes<RoleBase, MongooseBase> {
    try {
        const res = await this.roleModel.findOneAndDelete(props)
        if (!res) throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseRoleRepo, "delete")
        return this.documentToPrimary(res)
    } catch (error) {
        throw createDomainError(ErrorCodes.DATABASE_ACTION, MongooseRoleRepo, 'delete', undefined, { optionalMessage: 'Failed to delete the document' });
    }
  }
}
