import { Injectable } from "@nestjs/common";
import { RoleRepository } from "src/application/interfaces/entities/role.interface";

@Injectable()
export class RoleService<
TDBBase extends TDBBaseMockup,
TUpdateByIdMeta extends UpdateByIdMeta<RoleBase>,
TReadMeta extends ReadMeta<RoleBase>,
TDeleteMeta extends DeleteMeta<RoleBase>
> {
    constructor(
        private readonly roleRepository: RoleRepository<TDBBase, TUpdateByIdMeta, TReadMeta, TDeleteMeta>
    ){}
    async create(data: Omit<RoleBase, "id">): Promise<RoleBase & TDBBase> {
        return await this.roleRepository.create(data)
    }
    async readAll(): Promise<(RoleBase & TDBBase)[] | []> {
        return await this.roleRepository.read()
    }
    async readById(id: TDBBase["id"]): Promise<RoleBase & TDBBase> {
        return await this.roleRepository.readById(id)
    }
    async updateRole(id: TDBBase["id"], role?:Partial<RoleBase>|undefined): Promise<RoleBase & TDBBase> {
        return this.roleRepository.updateById(id, role)
    }
    async deleteById (id: DeleteByIdProps<TDBBase>) : Promise<RoleBase & TDBBase> {
        return await this.roleRepository.deleteById(id)
    }
    async delete (props: DeleteProps<RoleBase, TDeleteMeta>) : Promise<RoleBase & TDBBase[]> {
        return await this.roleRepository.delete(props)
    }

}