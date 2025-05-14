import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserAuthMockGuard } from '../guards/user-auth-mock.guard';
import { UserAuthMockStrategy } from 'src/presentation/adapters/user-auth-mock.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserAuthThirdwebStrategy } from 'src/presentation/adapters/user-auth-thirdweb.strategy';
import { UserAuthThirdwebGuard } from '../guards/user-auth-thirdweb.guard';
import { Reflector } from '@nestjs/core';
import { UserAuthThirdwebRepo } from 'src/infrastructure/shared/user-auth-thirdweb.repo';
import { UserAuthService } from 'src/application/usecases/shared/user-auth.service';
import { UserAuthRepository } from 'src/application/interfaces/shared/user-auth.interface';


@Module({
  imports: [PassportModule],
  providers: [UserAuthMockGuard, UserAuthMockStrategy],
})
export class UserAuthMockModule {}
@Module({
  imports: [ConfigModule],
  providers: [
    UserAuthThirdwebStrategy,
    UserAuthThirdwebGuard,
    UserAuthThirdwebRepo,
    {
      provide: UserAuthRepository,
      useExisting: UserAuthThirdwebRepo
    },
    UserAuthService,
    Reflector
  ],
  // exports: [UserAuthThirdwebStrategy, UserAuthThirdwebGuard, UserAuthService]
  // exports:[UserAuthThirdwebGuard]
})
export class UserAuthThirdwebModule {}
// IDEA for future
// @Module({
//     imports: [
//         ConfigModule,
//         PassportModule.register({defaultStrategy: "jwt"}), //Esto esta definido en el guard (y yasta?)
//         JwtModule.registerAsync({
//             imports: [ConfigModule],
//             inject: [ConfigService],
//             useFactory: async(configService: ConfigService )=> ({
//                 // Si thirdweb usa HS256
//                 // secretOrPublicKey: configService.get<string>('JWT_SECRET_KEY'),
//                 // Si Thirdweb usa RS256, usarías publicKey en lugar de secret
//                 publicKey: configService.get<string>('JWT_PUBLIC_KEY'),
//                 verifyOptions: {
//                     algorithms: ["ES256"]
//                 }
//             }),
            
//         }),
//         //UserModule
//     ],
//     // controllers: [AuthUserController],
//     providers: [
//         // AuthUserService,
//         JwtAuthUserStrategy,
//         // {
//         //     provide: AuthUserRepository,
//         //     useClass: AuthUserRepo,
            
//         // }
    
//     ],
//     exports: [
//         // AuthUserService, 
//         JwtAuthUserStrategy, 
//         PassportModule]
// })
// export class JwtAuthUserModule {}