import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreTechController } from 'src/presentation/controllers/pre-tech.controller';
import { PreTechSchemaFactory } from 'src/infrastructure/mongoose/schemas/pre-tech.schema';
import { PreTechService } from 'src/application/usecases/entities/pre-tech.service';
import { MongoosePreTechRepo } from 'src/infrastructure/mongoose/entities/pre-tech.repo';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PreTech', schema: PreTechSchemaFactory },
    ]),
  ],
  controllers: [PreTechController],
  providers: [
    MongoosePreTechRepo,
    {
      provide: PreTechService,
      useFactory: (repo: MongoosePreTechRepo) => {
        return new PreTechService(repo)
      },
      inject: [MongoosePreTechRepo],
    }
  ],
  exports: [
    // PreTechService // -> Al no utilizar-se fuera del 'modulo' -> osea el subconjunto marcado por este archivo, no es necesario exportarlo
  ], // Esto es lo que se podrá utilizar fuera del 'módulo'
})
export class PreTechModule {}
