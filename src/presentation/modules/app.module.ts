import { Module } from '@nestjs/common';
import { PreTechModule } from './pre-tech.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthUserModule } from './auth-user.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 aquí le pasamos la conexión a la uri (dotenv) para tener acceso a ella
    MongooseModule.forRoot(process.env.MONGODB_URI!), // 👈 aquí le pasamos la conexión a la uri para tener acceso a ella
    PreTechModule,
    AuthUserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
