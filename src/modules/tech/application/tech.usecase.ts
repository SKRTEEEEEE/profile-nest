import { Inject, Injectable } from '@nestjs/common';
// import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";
import { LengBase, TechBase, TechForm } from 'src/domain/entities/tech';
import { TechRepository } from './tech.interface';
import { TECH_REPOSITORY } from 'src/modules/tokens';

// Si esto funciona asi, probablemente sea la mejor manera asi expongo los Service que quiero

@Injectable()
export class TechCreateUseCase<TDB> {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository<TDB>,
  ) {}

  async create(data: Omit<TechBase, 'id'>): Promise<LengBase & TDB> {
    return await this.techRepo.create(data as LengBase);
  }
}

@Injectable()
export class TechReadByIdUseCase<TDB> {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository<TDB>,
  ) {}

  async readById(id: string): Promise<LengBase & TDB> {
    return await this.techRepo.readById(id);
  }
}

//El read normal esta en usecase separado
@Injectable()
export class TechReadOneUseCase<TDB> {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository<TDB>,
  ) {}
  async readOne(filter: Record<string, any>) {
    return await this.techRepo.readOne(filter);
  }
}

@Injectable()
export class TechUpdateUseCase<TDB> {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository<TDB>,
  ) {}

  async updateByForm(
    props: Partial<TechForm>,
  ): Promise<(LengBase & TDB) | undefined> {
    return await this.techRepo.updateByForm(props);
  }
  async updateByNameId(
    nameId: string,
    updateData: Partial<LengBase>,
  ): Promise<(LengBase & TDB) | undefined | null> {
    return await this.techRepo.updateByNameId(nameId, updateData);
  }
}

@Injectable()
export class TechUpdateByIdUseCase<TDB> {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository<TDB>,
  ) {}

  async updateById(props: UpdateByIdProps<LengBase>): Promise<LengBase & TDB> {
    return await this.techRepo.updateById(props);
  }
}

@Injectable()
export class TechDeleteUseCase<TDB> implements DeleteI<PreTechBase, TDB> {
  constructor(
    @Inject(TECH_REPOSITORY) private readonly techRepo: TechRepository<TDB>,
  ) {}

  async delete(props: DeleteProps<LengBase, TDB>): DeleteRes<LengBase, TDB> {
    return await this.techRepo.delete(props);
  }
}
