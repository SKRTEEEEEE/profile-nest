import { Module } from '@nestjs/common';
import { MongoosePreTechModule } from './pre-tech.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    MongoosePreTechModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
