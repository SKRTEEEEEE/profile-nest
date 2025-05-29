import { IsString, Matches } from 'class-validator';
import {  LoginPayload, VerifyLoginPayloadParams } from 'thirdweb/auth';

export class AuthThirdWebVerifyPayloadDto implements VerifyLoginPayloadParams {
    @IsString()
    @Matches(/^0x[a-fA-F0-9]+$/, { message: "signature must be a valid hex string starting with 0x" })
    signature: `0x${string}` | string;
    // No validation for payload, as it's a complex object from thirdweb/auth
    payload: LoginPayload;
}

export class AuthThirdWebVerifyJwtDto {
    @IsString()
    token: string
} 