import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthThirdwebGuard } from './shareds/jwt-auth/presentation/jwt-auth-thirdweb.guard';
import { JwtAuthModule } from './shareds/jwt-auth/presentation/jwt-auth.module';
import { RoleAuthModule } from './shareds/role-auth/presentation/role-auth.module';
import { RoleAuthUseCase } from './shareds/role-auth/application/role-auth.usecase';
import { TechModule } from './modules/tech/presentation/tech.module';
import { PreTechModule } from './modules/pre-tech/presentation/pre-tech.module';
import { ResponseInterceptor } from './shareds/presentation/response.guard';
import { UserModule } from './modules/user/presentation/user.module';
import { RoleModule } from './modules/role/presentation/role.module';



@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 aquí le pasamos la conexión a dotenv
    MongooseModule.forRoot(process.env.MONGODB_URI!), // 👈 aquí le pasamos la conexión a la uri para que mongoose tenga acceso
    PreTechModule,
    TechModule,
    UserModule,
    JwtAuthModule,
    RoleAuthModule,
    RoleModule,
    // OctokitModule
    // MockAuthUserModule,
  ],
  controllers: [],
  providers: [
     // Aplicar el JwtAuthGuard globalmente (todas las rutas requieren autenticación por defecto) - se utiliza aquí porque requiere de reflector y no necesita new ...
     {
      provide: APP_GUARD,
      useClass: JwtAuthThirdwebGuard,
      // useClass: MockAuthUserGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    RoleAuthUseCase
  ]
})
export class AppModule {}
