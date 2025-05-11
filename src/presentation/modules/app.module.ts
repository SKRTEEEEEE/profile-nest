import { Module } from '@nestjs/common';
import { PreTechModule } from './pre-tech.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// import { JwtAuthUserModule } from './auth-user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthUserGuard } from '../guards/jwt-auth-user.guard';
import { MockAuthUserGuard } from '../guards/mock-auth-user.guard';
import { MockAuthUserModule } from './mock-auth-user.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 aquí le pasamos la conexión a la uri (dotenv) para tener acceso a ella
    MongooseModule.forRoot(process.env.MONGODB_URI!), // 👈 aquí le pasamos la conexión a la uri para tener acceso a ella
    PreTechModule,
    // JwtAuthUserModule,
    MockAuthUserModule,
  ],
  controllers: [],
  providers: [
     // Aplicar el JwtAuthGuard globalmente (todas las rutas requieren autenticación por defecto)
     {
      provide: APP_GUARD,
      // useClass: JwtAuthUserGuard,
      useClass: MockAuthUserGuard
    },
  ],
})
export class AppModule {}
