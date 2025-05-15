import { Module, ValidationPipe } from '@nestjs/common';
import { PreTechModule } from './pre-tech.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthThirdwebGuard } from '../guards/user-auth-thirdweb.guard';
import { RoleAuthService } from '../../application/usecases/shareds/role-auth.service';
import { UserAuthThirdwebModule } from './user-auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 aquí le pasamos la conexión a dotenv
    MongooseModule.forRoot(process.env.MONGODB_URI!), // 👈 aquí le pasamos la conexión a la uri para que mongoose tenga acceso
    PreTechModule,
    UserAuthThirdwebModule,
    // MockAuthUserModule,
  ],
  controllers: [],
  providers: [
     // Aplicar el JwtAuthGuard globalmente (todas las rutas requieren autenticación por defecto) - se utiliza aquí porque requiere de reflector y no necesita new ...
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
