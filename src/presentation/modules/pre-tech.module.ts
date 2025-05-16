import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreTechController } from 'src/presentation/controllers/pre-tech.controller';
import { PreTechSchemaFactory } from 'src/infrastructure/mongoose/schemas/pre-tech.schema';
import { PreTechEndpointService, PreTechRpService } from 'src/application/usecases/entities/pre-tech.service';
import { MongoosePreTechRepo } from 'src/infrastructure/mongoose/entities/pre-tech.repo';
import { RoleAuthService } from '../../application/usecases/shareds/role-auth.service';
import { RPRepository } from 'src/application/interfaces/patterns/rp.interface';
import { PreTechRepository } from 'src/application/interfaces/entities/pre-tech.interface';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PreTech', schema: PreTechSchemaFactory },
    ]),
  ],
  controllers: [PreTechController],
  providers: [
    {
      provide: RPRepository,
      useClass: MongoosePreTechRepo,
    },
    {
      provide: PreTechRepository,
      useClass: MongoosePreTechRepo
    },
    PreTechRpService,
    PreTechEndpointService,
    // RoleAuthService 
  ],
  exports: [
    // PreTechEndpointService // -> Al no utilizar-se fuera del 'modulo' -> osea el subconjunto marcado por este archivo, no es necesario exportarlo
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
//       provide: PreTechEndpointService,
//       useFactory: (repo: MongoosePreTechRepo) => {
//         return new PreTechEndpointService(repo)
//       },
//       inject: [MongoosePreTechRepo],
//     }
//     ,RoleAuthService 
//   ],
//   exports: [
//     // PreTechEndpointService // -> Al no utilizar-se fuera del 'modulo' -> osea el subconjunto marcado por este archivo, no es necesario exportarlo
//   ], // Esto es lo que se podrá utilizar fuera del 'módulo'
// })
// export class PreTechModule {}
