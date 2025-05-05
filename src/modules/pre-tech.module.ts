import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoosePreTechRepo } from '../infrastructure/mongoose/entities/pre-tech.repo';
import { PreTechController } from 'src/presentation/controllers/pre-tech.controller';
import { PreTechSchemaFactory } from 'src/infrastructure/mongoose/schemas/pre-tech.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PreTech', schema: PreTechSchemaFactory },
    ]),
  ],
  controllers: [PreTechController],
  providers: [
    MongoosePreTechRepo
  ],
  exports: [MongoosePreTechRepo],
})
export class MongoosePreTechModule {}
