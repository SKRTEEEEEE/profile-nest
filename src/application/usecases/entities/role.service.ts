import { Injectable } from "@nestjs/common";
import { RoleRepository } from "src/application/interfaces/entities/role.interface";
import { RoleBase } from "src/domain/entities/role";

@Injectable()
export class RoleService<
TDBBase
> implements RoleRepository<TDBBase>{
    constructor(
        private readonly roleRepository: RoleRepository<TDBBase>
    ){}
    async create(data: Omit<RoleBase, "id">) {
        return await this.roleRepository.create(data)
    }
    async read(props?: ReadProps<RoleBase, TDBBase>): Promise<[] | (RoleBase & TDBBase)[]> {
        return await this.roleRepository.read(props)
    }
    async readAll() {
        return await this.roleRepository.read()
    }
    async readById(id: ReadByIdProps<TDBBase>) {
        return await this.roleRepository.readById(id)
    }
    async updateRole(props: UpdateByIdProps<RoleBase, TDBBase>) {
        return this.roleRepository.updateById(props)
    }
    updateById(props: UpdateByIdProps<RoleBase, TDBBase>): Promise<RoleBase & TDBBase> {
        return this.roleRepository.updateById(props)
    }
    async deleteById (id: DeleteByIdProps<TDBBase>)  {
        return await this.roleRepository.deleteById(id)
    }
    async delete (props: DeleteProps<RoleBase, TDBBase>)  {
        return await this.roleRepository.delete(props)
    }

}