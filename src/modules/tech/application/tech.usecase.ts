import { Inject, Injectable } from '@nestjs/common';
// import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import {  LengBase, TechBase, TechForm } from 'src/domain/entities/tech';
import { Leng, TechRepository } from './tech.interface';
import { TECH_REPOSITORY } from 'src/modules/tokens';
import { DeleteI, DeleteProps } from 'src/shareds/pattern/application/interfaces/delete';
import { DBBase } from 'src/dynamic.types';
import { UpdateByIdProps } from 'src/shareds/pattern/application/interfaces/cru';

// Si esto funciona asi, probablemente sea la mejor manera asi expongo los Service que quiero

@Injectable()
export class TechCreateUseCase {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository,
  ) {}

  async create(data: Omit<TechBase, 'id'>) {
    return await this.techRepo.create(data as LengBase);
  }
}

@Injectable()
export class TechReadByIdUseCase {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository,
  ) {}

  async readById(id: string): Promise<LengBase & DBBase> {
    return await this.techRepo.readById(id);
  }
}

//El read normal esta en usecase separado
@Injectable()
export class TechReadOneUseCase {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository,
  ) {}
  async readOne(filter: Record<string, any>) {
    return await this.techRepo.readOne(filter);
  }
}

@Injectable()
export class TechUpdateUseCase {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository,
  ) {}

  async updateByForm(
    props: Partial<TechForm>,
  ): Promise<(LengBase & DBBase) | undefined> {
    return await this.techRepo.updateByForm(props);
  }
  async updateByNameId(
    nameId: string,
    updateData: Partial<LengBase>,
  ): Promise<(LengBase & DBBase) | undefined | null> {
    return await this.techRepo.updateByNameId(nameId, updateData);
  }
}

@Injectable()
export class TechUpdateByIdUseCase {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository,
  ) {}

  async updateById(props: UpdateByIdProps<Leng>): Promise<LengBase & DBBase> {
    return await this.techRepo.updateById(props);
  }
}

@Injectable()
export class TechDeleteUseCase {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository,
  ) {}

  async delete(props: DeleteProps<LengBase>): Promise<LengBase & DBBase> {
    return await this.techRepo.delete(props);
  }
}
