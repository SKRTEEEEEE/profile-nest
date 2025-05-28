import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthMockGuard } from './jwt-auth-mock.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthThirdwebGuard } from './jwt-auth-thirdweb.guard';
import { Reflector } from '@nestjs/core';
import { JwtAuthThirdwebRepo } from 'src/shareds/jwt-auth/infrastructure/jwt-auth-thirdweb.repo';
import { JwtAuthUseCase } from 'src/shareds/jwt-auth/application/jwt-auth.usecase';
import { JwtAuthInterface } from 'src/shareds/jwt-auth/application/jwt-auth.interface';
import { JwtAuthMockStrategy } from './jwt-auth-mock.strategy';
import { JwtAuthThirdwebStrategy } from './jwt-auth-thirdweb.strategy';
import { ThirdWebModule } from 'src/shareds/thirdweb/thirdweb.module';


@Module({
  imports: [PassportModule],
  providers: [JwtAuthMockGuard, JwtAuthMockStrategy],
})
export class JwtAuthMockModule {}
@Module({
  imports: [ConfigModule, ThirdWebModule],
  providers: [
    JwtAuthThirdwebStrategy,
    JwtAuthThirdwebGuard,
    JwtAuthThirdwebRepo,
    {
      provide: JwtAuthInterface,
      useExisting: JwtAuthThirdwebRepo
    },
    JwtAuthUseCase,
    Reflector
  ],
  // exports: [JwtAuthThirdwebStrategy, JwtAuthThirdwebGuard, JwtAuthUseCase]
  // exports:[JwtAuthThirdwebGuard]
})
export class JwtAuthModule {}
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