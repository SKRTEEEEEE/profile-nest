import { Injectable } from "@nestjs/common";
import { CRRUDDRepository } from "src/application/interfaces/patterns/crrudd.interface";
import { RoleBase } from "src/domain/entities/role";

@Injectable()
export class RoleCrruddService<
TDBase
> 
implements CRRUDDRepository<RoleBase, TDBase>
{
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase,TDBase>
    ){}
    async create(data: Omit<RoleBase, "id">) {
        return await this.crruddRepository.create(data)
    }
    async read(props?: ReadProps<RoleBase, TDBase>): Promise<[] | (RoleBase & TDBase)[]> {
        return await this.crruddRepository.read(props)
    }
    async readAll() {
        return await this.crruddRepository.read()
    }
    async readById(id: ReadByIdProps<TDBase>) {
        return await this.crruddRepository.readById(id)
    }
    // async updateRole(props: UpdateByIdProps<RoleBase, TDBase>) {
    //     return this.crruddRepository.updateById(props)
    // }
    async updateById(props: UpdateByIdProps<RoleBase, TDBase>): Promise<RoleBase & TDBase> {
        return this.crruddRepository.updateById(props)
    }
    async deleteById (id: DeleteByIdProps<TDBase>)  {
        return await this.crruddRepository.deleteById(id)
    }
    async delete (props: DeleteProps<RoleBase, TDBase>)  {
        return await this.crruddRepository.delete(props)
    }

}