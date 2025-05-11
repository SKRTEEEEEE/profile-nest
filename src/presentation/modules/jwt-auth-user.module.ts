import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthUserStrategy } from "src/infrastructure/adapters/jwt-auth-user.strategy";

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({defaultStrategy: "jwt"}), //Esto esta definido en el guard (y yasta?)
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async(configService: ConfigService )=> ({
                // Si thirdweb usa HS256
                // secretOrPublicKey: configService.get<string>('JWT_SECRET_KEY'),
                // Si Thirdweb usa RS256, usarías publicKey en lugar de secret
                publicKey: configService.get<string>("JWT_PUBLIC_KEY"),
                verifyOptions: {
                    algorithms: ["RS256"]
                }
            }),
            
        }),
        //UserModule
    ],
    // controllers: [AuthUserController],
    providers: [
        // AuthUserService,
        JwtAuthUserStrategy,
        // {
        //     provide: AuthUserRepository,
        //     useClass: AuthUserRepo,
            
        // }
    
    ],
    exports: [
        // AuthUserService, 
        JwtAuthUserStrategy, 
        PassportModule]
})
export class JwtAuthUserModule {}