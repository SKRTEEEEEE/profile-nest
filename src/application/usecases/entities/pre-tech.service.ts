import { Injectable } from '@nestjs/common';
import { PreTechRepository } from 'src/application/interfaces/entities/pre-tech.interface';

@Injectable()
export class PreTechService<
TDBBase, >
// TReadMeta extends ReadMeta<PreTechBase, TDBBase, any, any, any>> 
// TReadMeta extends ReadMeta<PreTechBase, TDBBase>> 
//  implements PreTechRepository<TDBBase> // Se puede implementar o no, si implementamos nos obligara a crear todas las funcs
{
    constructor(
      private readonly preTechRepository: PreTechRepository<TDBBase>
    ) {}
  
    // Aquí puedo usar los DTOs -> con tipos genéricos complejos (es el caso) ES MEJOR UTILIZAR LOS DTOs EN la capa de PRESENTACIÓN (controllers)
    async read(props: ReadProps<PreTechBase, TDBBase>) {
      
      return await this.preTechRepository.read(props)
    }
  
    async updatePreTech() {
      return await this.preTechRepository.updatePreTech()
    }
  
    async readByQuery(query: string) {
      return await this.preTechRepository.readByQuery(query)
    }

    // async populate(docs: PopulateProps<PreTechBase>): Promise<(PreTechBase & TDBBase)[]> {
    //   return await this.preTechRepository.populate(docs)
    // }
  }
