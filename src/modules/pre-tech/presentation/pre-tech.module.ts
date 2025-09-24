import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreTechSchemaFactory } from '../infrastructure/pre-tech.schema';
import { PreTechController } from './pre-tech.controller';
import { MongoosePreTechRepo } from '../infrastructure/pre-tech.repo';
import { PreTechEndpointUseCase } from '../application/pre-tech.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PreTech', schema: PreTechSchemaFactory },
    ]),
  ],
  controllers: [PreTechController],
  providers: [
    // {
    //   provide: RPRepository,
    //   useClass: MongoosePreTechRepo,
    // },
    {
      provide: 'PreTechRepository',
      useClass: MongoosePreTechRepo,
    },
    // {
    //   provide: PreTechReadUseCase,
    //   useFactory:(repo) => new PreTechReadUseCase(repo),
    //   inject: ['PreTechRepository']
    // },
    // {
    //   provide: PreTechPopulateUseCase,
    //   useFactory:(repo) => new PreTechPopulateUseCase(repo),
    //   inject: ['PreTechRepository']
    // },
    // {
    //   provide: PreTechInterface,
    //   useClass: MongoosePreTechRepo
    // }, // -> Puedo comentarlo porque le 'inyecto' PreTechRepository
    // PreTechReadUseCase,
    // PreTechPopulateUseCase,
    PreTechEndpointUseCase,
    // RoleAuthUseCase
  ],
  exports: [
    // PreTechEndpointUseCase // -> Al no utilizar-se fuera del 'modulo' -> osea el subconjunto marcado por este archivo, no es necesario exportarlo
  ], // Esto es lo que se podrá utilizar fuera del 'módulo'
})
export class PreTechModule {}

// TODO - Acabar de analizar useFactory vs useClass
// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: 'PreTech', schema: PreTechSchemaFactory },
//     ]),
//   ],
//   controllers: [PreTechController],
//   providers: [
//     MongoosePreTechRepo,
//     {
//       provide: PreTechEndpointUseCase,
//       useFactory: (repo: MongoosePreTechRepo) => {
//         return new PreTechEndpointUseCase(repo)
//       },
//       inject: [MongoosePreTechRepo],
//     }
//     ,RoleAuthUseCase
//   ],
//   exports: [
//     // PreTechEndpointUseCase // -> Al no utilizar-se fuera del 'modulo' -> osea el subconjunto marcado por este archivo, no es necesario exportarlo
//   ], // Esto es lo que se podrá utilizar fuera del 'módulo'
// })
// export class PreTechModule {}
