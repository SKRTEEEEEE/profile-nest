import { Module, ValidationPipe } from '@nestjs/common';
import { PreTechModule } from './pre-tech.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { UserAuthThirdwebGuard } from '../guards/user-auth-thirdweb.guard';
import { RoleAuthService } from '../../application/usecases/shared/role-auth.service';
import { UserAuthThirdwebModule } from './user-auth.module';
import { GlobalValidationPipe, validationOptions } from '../pipes/global.validation';


@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 aquí le pasamos la conexión a la uri (dotenv) para tener acceso a ella
    MongooseModule.forRoot(process.env.MONGODB_URI!), // 👈 aquí le pasamos la conexión a la uri para tener acceso a ella
    PreTechModule,
    UserAuthThirdwebModule,
    // MockAuthUserModule,
  ],
  controllers: [],
  providers: [
     // Aplicar el JwtAuthGuard globalmente (todas las rutas requieren autenticación por defecto)
     {
      provide: APP_GUARD,
      useClass: UserAuthThirdwebGuard,
      // useClass: MockAuthUserGuard
    },
    // {
    //   provide: APP_PIPE,
    //   useValue: new GlobalValidationPipe(),
    // },
    RoleAuthService
  ],
})
export class AppModule {}
