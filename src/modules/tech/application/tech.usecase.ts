import { Inject, Injectable } from "@nestjs/common";
import { CRRUUDRepository } from "src/shareds/pattern/application/usecases/crruud.interface";
// import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import {  LengBase, TechBase } from "src/domain/entities/tech";

// Si esto funciona asi, probablemente sea la mejor manera asi expongo los Service que quiero

@Injectable()
export class TechCreateUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async create(data: Omit<TechBase, "id">): Promise<LengBase & TDB> {
        return await this.crruudRepository.create(data as LengBase);
    }
}
@Injectable()
export class TechReadByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async readById(id: ReadByIdProps<TDB>): Promise<LengBase & TDB> {
        return await this.crruudRepository.readById(id);
    }
}
//El read normal esta en usecase separado
@Injectable()
export class TechReadOneUseCase<TDB> implements ReadOneI<LengBase, TDB>{
    constructor(
        @Inject("TechRepository")
        private readonly readOneRepository: ReadOneI<LengBase, TDB>
    ){}
    async readOne(filter: ReadOneProps<LengBase, TDB>){
        return await this.readOneRepository.readOne(filter)
    }
}

@Injectable()
export class TechUpdateUseCase<TDB> implements UpdateI<TechBase, TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async update(props: UpdateProps<LengBase, TDB>): UpdateRes<LengBase, TDB> {
        return await this.crruudRepository.update(props);
    }
}
@Injectable()
export class TechUpdateByIdUseCase<TDB>  {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async updateById(props: UpdateByIdProps<LengBase, TDB>): Promise<LengBase & TDB> {
        return await this.crruudRepository.updateById(props);
    }
}
@Injectable()
export class TechDeleteUseCase<TDB> implements DeleteI<PreTechBase, TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async delete(props: DeleteProps<LengBase, TDB>): DeleteRes<LengBase, TDB> {
        return await this.crruudRepository.delete(props);
    }
}