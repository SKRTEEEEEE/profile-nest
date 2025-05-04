import { Injectable } from '@nestjs/common';
import { PreTechRepository } from 'src/application/interfaces/entities/pre-tech.interface';
import { PreTechBase } from 'src/domain/entities/pre-tech';
import { ReadMeta, ReadProps } from 'src/domain/interfaces/read';

@Injectable()
export class PreTechService<TDBBase, TReadMeta extends ReadMeta<PreTechBase>> {
    constructor(
      private readonly preTechRepository: PreTechRepository<PreTechBase, TDBBase, TReadMeta>
    ) {}
  
    // Aquí puedo usar los DTOs -> con tipos genéricos complejos (es el caso) ES MEJOR UTILIZAR LOS DTOs EN la capa de PRESENTACIÓN (controllers)
    async read(props: ReadProps<PreTechBase, TReadMeta>) {
      return await this.preTechRepository.read(props)
    }
  
    async updatePreTech() {
      return await this.preTechRepository.updatePreTech()
    }
  
    async readByQuery(query: string) {
      return await this.preTechRepository.readByQuery(query)
    }
  }
