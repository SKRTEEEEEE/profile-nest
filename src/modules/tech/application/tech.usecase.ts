import { Injectable } from "@nestjs/common";
import { CRRUUDRepository } from "src/shareds/pattern/application/usecases/crruud.interface";
import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import {  LengBase, TechBase } from "src/domain/entities/tech";

// Si esto funciona asi, probablemente sea la mejor manera asi expongo los Service que quiero

@Injectable()
export class TechReadOneUseCase<TDB> implements ReadOneRepository<LengBase, TDB>{
    constructor(
        private readonly readOneRepository: ReadOneRepository<LengBase, TDB>
    ){}
    async readOne(filter: ReadOneProps<LengBase, TDB>){
        return await this.readOneRepository.readOne(filter)
    }
}

// Service for creating a Tech entity
@Injectable()
export class TechCreateUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async create(data: Omit<TechBase, "id">): Promise<LengBase & TDB> {
        return await this.crruudRepository.create(data as LengBase);
    }
}



// Service for reading a Tech entity by ID
@Injectable()
export class TechReadByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async readById(id: ReadByIdProps<TDB>): Promise<LengBase & TDB> {
        return await this.crruudRepository.readById(id);
    }
}

// Service for updating Tech entities
@Injectable()
export class TechUpdateUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async update(props: UpdateProps<LengBase, TDB>): UpdateRes<LengBase, TDB> {
        return await this.crruudRepository.update(props);
    }
}

// Service for updating a Tech entity by ID
@Injectable()
export class TechUpdateByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async updateById(props: UpdateByIdProps<LengBase, TDB>): Promise<LengBase & TDB> {
        return await this.crruudRepository.updateById(props);
    }
}

// Service for deleting Tech entities
@Injectable()
export class TechDeleteUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDRepository<LengBase, TDB>
    ) {}

    async delete(props: DeleteProps<LengBase, TDB>): DeleteRes<LengBase, TDB> {
        return await this.crruudRepository.delete(props);
    }
}