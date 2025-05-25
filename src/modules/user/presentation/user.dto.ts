import { Type } from "class-transformer";
import { IsEnum,  IsOptional,  IsString, Matches, ValidateNested } from "class-validator";
import { RoleType } from "src/domain/entities/role.type";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { AuthThirdWebVerifyPayloadDto } from "src/shareds/thirdweb/auth-thirdweb.dto";
import { LoginPayload } from "thirdweb/auth";
import { UserNodemailerUpdateProps } from "../application/user-nodemailer.usecase";

type UserRoleThirdWebDeleteProps = {
    payload: {
        signature: `0x${string}` | string;
        payload: LoginPayload;
    };
    id: string;
    address: string;
};



export class UserRoleThirdWebDeleteDto implements UserRoleThirdWebDeleteProps {
    @ValidateNested()
    @Type(() => AuthThirdWebVerifyPayloadDto)
    payload: AuthThirdWebVerifyPayloadDto;

    @IsString()
    id: string;

    @IsString()
    address: string;
}

type UserRoleThirdWebGiveRoleProps = {
    payload: {
  signature: `0x${string}` | string;
  payload: LoginPayload;
}, id: ReadByIdProps<MongooseBase>, solicitud: RoleType.ADMIN
}
export class UserRoleThirdWebGiveRoleDto implements UserRoleThirdWebGiveRoleProps {
    @ValidateNested()
    @Type(() => AuthThirdWebVerifyPayloadDto)
    payload: AuthThirdWebVerifyPayloadDto;

    @IsString()
    id: ReadByIdProps<MongooseBase>;

    @IsEnum(RoleType)
    solicitud: RoleType.ADMIN;
}

export class UserUpdateSolicitudDto {
    @IsString()
    id: string;

    @IsString()
    @IsEnum(RoleType)
    solicitud: RoleType;
}

export class UserNodemailerUpdateDto implements UserNodemailerUpdateProps {
    @IsString()
    id: string;

    @IsOptional()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    email?: string | null;

    @IsString()
    nick: string;

    @IsOptional()
    @IsString()
    img: string | null;
}
export class UserVerifyEmailDto {
    @IsString()
    id: string;
    @IsString()
    verifyToken: string
}