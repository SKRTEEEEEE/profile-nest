import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthThirdwebGuard } from './shareds/jwt-auth/presentation/jwt-auth-thirdweb.guard';
import { JwtAuthMockModule, JwtAuthThirdWebModule } from './shareds/jwt-auth/presentation/jwt-auth.module';
import { RoleAuthModule } from './shareds/role-auth/presentation/role-auth.module';
import { RoleAuthUseCase } from './shareds/role-auth/application/role-auth.usecase';
import { TechModule } from './modules/tech/presentation/tech.module';
import { PreTechModule } from './modules/pre-tech/presentation/pre-tech.module';
import { ResponseInterceptor } from './shareds/presentation/response.interceptor';
import { UserModule } from './modules/user/presentation/user.module';
import { RoleModule } from './modules/role/presentation/role.module';
import { JwtAuthMockGuard } from './shareds/jwt-auth/presentation/jwt-auth-mock.guard';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';



@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 aquí le pasamos la conexión a dotenv
    MongooseModule.forRoot(process.env.MONGODB_URI!), // 👈 aquí le pasamos la conexión a la uri para que mongoose tenga acceso
    PreTechModule,
    TechModule,
    UserModule,
    process.env.JWT_STRATEGY === "mock" ?JwtAuthMockModule:JwtAuthThirdWebModule,
    RoleAuthModule,
    RoleModule,
    // OctokitModule
    // MockAuthUserModule,
    // CacheModule.register({max:100}),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
  
  ],
  controllers: [],
  providers: [
     // Aplicar el JwtAuthGuard globalmente (todas las rutas requieren autenticación por defecto) - se utiliza aquí porque requiere de reflector y no necesita new ...
     {
      provide: APP_GUARD,
      useClass: process.env.JWT_STRATEGY === "mock" ? JwtAuthMockGuard: JwtAuthThirdwebGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor
    // },
    RoleAuthUseCase
  ]
})
export class AppModule {}
