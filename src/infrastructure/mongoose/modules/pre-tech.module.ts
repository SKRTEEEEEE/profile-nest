import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoosePreTechRepo } from '../entities/pre-tech.repo';
import { preTechSchemaFactory } from '../schemas/pre-tech.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PreTech', schema: preTechSchemaFactory },
    ]),
  ],
  providers: [MongoosePreTechRepo],
  exports: [MongoosePreTechRepo],
})
export class MongoosePreTechModule {}
