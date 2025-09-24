import { Inject, Injectable } from '@nestjs/common';
import { PreTechInterface } from './pre-tech.interface';

@Injectable()
// TReadMeta extends ReadMeta<PreTechBase, TDBBase, any, any, any>>
// TReadMeta extends ReadMeta<PreTechBase, TDBBase>>
// Se puede implementar o no, si implementamos nos obligara a crear todas las funcs
export class PreTechEndpointUseCase<TDBBase>
  implements PreTechInterface<TDBBase>
{
  constructor(
    @Inject('PreTechRepository')
    private readonly preTechRepository: PreTechInterface<TDBBase>,
  ) {}

  async updatePreTech() {
    return await this.preTechRepository.updatePreTech();
  }

  async readByQuery(query: { q: string }) {
    return await this.preTechRepository.readByQuery(query);
  }
}

//   @Injectable()
// export class PreTechReadUseCase<TDB> {
//   constructor(
//     @Inject('PreTechRepository')
//     private readonly repo: ReadI<PreTechBase, TDB>
//   ) {}

//   async execute(props: ReadProps<PreTechBase, TDB>) {
//     return this.repo.read(props);
//   }
// }

// @Injectable()
// export class PreTechPopulateUseCase<TDB> {
//   constructor(
//     @Inject('PreTechRepository')
//     private readonly repo: PopulateI<PreTechBase, TDB>
//   ) {}

//   async execute(docs) {
//     return this.repo.populate(docs);
//   }
// }
