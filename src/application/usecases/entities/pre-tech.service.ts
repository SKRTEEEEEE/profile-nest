import { Injectable } from '@nestjs/common';
import { PreTechRepository } from 'src/application/interfaces/entities/pre-tech.interface';
import { RPRepository } from 'src/application/interfaces/patterns/rp.interface';

@Injectable()
export class PreTechEndpointService<
TDBBase, >
// TReadMeta extends ReadMeta<PreTechBase, TDBBase, any, any, any>> 
// TReadMeta extends ReadMeta<PreTechBase, TDBBase>> 
 implements PreTechRepository<TDBBase> // Se puede implementar o no, si implementamos nos obligara a crear todas las funcs
{
    constructor(
      private readonly preTechRepository: PreTechRepository<TDBBase>
    ) {}
  

  
    async updatePreTech() {
      return await this.preTechRepository.updatePreTech()
    }
  
    async readByQuery(query: string) {
      return await this.preTechRepository.readByQuery(query)
    }

  }

  @Injectable()
  export class PreTechRpService<TDB>
  implements RPRepository<PreTechBase, TDB> 
  {
    constructor(
      private readonly rpRepository: RPRepository<PreTechBase, TDB>
    ){}
        // Aquí puedo usar los DTOs -> con tipos genéricos complejos (es el caso) ES MEJOR UTILIZAR LOS DTOs EN la capa de PRESENTACIÓN (controllers)
    async read(props: ReadProps<PreTechBase, TDB>) {
      
      return await this.rpRepository.read(props)
    }
    async populate(docs: PopulateProps<PreTechBase>): Promise<(PreTechBase & TDB)[]> {
      return await this.rpRepository.populate(docs)
    }
  }