import { Injectable } from "@nestjs/common";
import { RoleRepository } from "src/application/interfaces/entities/role.interface";
import { RoleBase } from "src/domain/entities/role";

@Injectable()
export class RoleService<
TDBBase
> {
    constructor(
        private readonly roleRepository: RoleRepository<TDBBase>
    ){}
    async create(data: Omit<RoleBase, "id">): Promise<RoleBase & TDBBase> {
        return await this.roleRepository.create(data)
    }
    async readAll(): Promise<(RoleBase & TDBBase)[] | []> {
        return await this.roleRepository.read()
    }
    async readById(id: ReadByIdProps<TDBBase>): Promise<RoleBase & TDBBase | null> {
        return await this.roleRepository.readById(id)
    }
    async updateRole(props: UpdateByIdProps<RoleBase, TDBBase>): Promise<RoleBase & TDBBase | null> {
        return this.roleRepository.updateById(props)
    }
    async deleteById (id: DeleteByIdProps<TDBBase>) : Promise<RoleBase & TDBBase> {
        return await this.roleRepository.deleteById(id)
    }
    async delete (props: DeleteProps<RoleBase, TDBBase>) : Promise<(RoleBase & TDBBase)[]> {
        return await this.roleRepository.delete(props)
    }

}