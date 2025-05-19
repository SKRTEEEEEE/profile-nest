import { Injectable } from "@nestjs/common";
import { CRRUUDIdRepository } from "src/shareds/pattern/application/usecases/crruud-id.interface";
import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";

@Injectable()
export class UserCreateUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>,
        
    ) {}

    async create(props: CreateProps<UserBase>): Promise<UserBase & TDB> {
        
        return await this.crruudRepository.create(props);
    }
}

@Injectable()
export class UserReadOneUseCase<TDB> {
    constructor(
        private readonly readOneRepository: ReadOneRepository<UserBase, TDB>
    ){}
    async readOne(props: ReadOneProps<UserBase, TDB>){
        return this.readOneRepository.readOne(props)
    }
    async readByAddress(address: string){
        return this.readOneRepository.readOne({address})
    }
}


@Injectable()
export class UserReadUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async read(filter?: ReadProps<UserBase, TDB>): Promise<(UserBase & TDB)[]> {
        return await this.crruudRepository.read(filter);
    }
}
@Injectable()
export class UserReadByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async readById(id: ReadByIdProps<TDB>): Promise<UserBase & TDB> {
        return await this.crruudRepository.readById(id);
    }
}
@Injectable()
export class UserUpdateUseCase<TDB> implements UpdateI<UserBase, TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async update(props: UpdateProps<UserBase, TDB>): UpdateRes<UserBase, TDB> {
        return await this.crruudRepository.update(props);
    }
}
@Injectable()
export class UserUpdateByIdUseCase<TDB>  {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async updateById(props: UpdateByIdProps<UserBase, TDB>): Promise<UserBase & TDB> {
        return await this.crruudRepository.updateById(props);
    }
}
@Injectable()
export class UserDeleteByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}
    async deleteById(props: DeleteByIdProps<TDB>): DeleteByIdRes<UserBase, TDB>{
        return this.crruudRepository.deleteById(props)
    }
}