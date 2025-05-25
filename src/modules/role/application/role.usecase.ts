import { Injectable } from "@nestjs/common";
import { RoleBase } from "src/domain/entities/role";
import { RoleType } from "src/domain/entities/role.type";
import { CRRUDDRepository } from "src/shareds/pattern/application/usecases/crrudd.interface";
import { RoleInterface } from "./role.interface";
import { PersistedEntity } from "src/shareds/pattern/application/interfaces/adapter.type";

@Injectable()
export class RoleCreateUseCase<TDB extends PersistedEntity = PersistedEntity> {
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase, TDB>
    ) {}

    async create(data: RoleBase): Promise<RoleBase & TDB> {
        return await this.crruddRepository.create(data);
    }
}

@Injectable()
export class RoleReadByIdUseCase<TDB> {
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase, TDB>
    ) {}

    async readById(id: ReadByIdProps<TDB>): Promise<RoleBase & TDB> {
        return await this.crruddRepository.readById(id);
    }
}

@Injectable()
export class RoleReadUseCase<TDB> implements ReadI<RoleBase, TDB>, RoleInterface {
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase, TDB>
    ) {}

    async read(filter?: ReadProps<RoleBase, TDB>): Promise<(RoleBase & TDB)[]> {
        return await this.crruddRepository.read(filter);
    }
    async isAdmin(address: string): Promise<boolean> {
        const roles = await this.crruddRepository.read({ filter: { address } });
        return roles.some(role => role.permissions === RoleType.ADMIN);
    }
}

@Injectable()
export class RoleUpdateByIdUseCase<TDB> {
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase, TDB>
    ) {}

    async updateById(props: UpdateByIdProps<RoleBase, TDB>): Promise<RoleBase & TDB> {
        return await this.crruddRepository.updateById(props);
    }
}

@Injectable()
export class RoleDeleteByIdUseCase<TDB> {
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase, TDB>
    ) {}

    async deleteById(id: DeleteByIdProps<TDB>): Promise<RoleBase & TDB> {
        return await this.crruddRepository.deleteById(id);
    }
}

@Injectable()
export class RoleDeleteUseCase<TDB> {
    constructor(
        private readonly crruddRepository: CRRUDDRepository<RoleBase, TDB>
    ) {}

    async delete(props: DeleteProps<RoleBase, TDB>): Promise<RoleBase & TDB> {
        return await this.crruddRepository.delete(props);
    }
}
