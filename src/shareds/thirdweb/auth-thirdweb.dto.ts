import { IsString, Matches } from 'class-validator';
import {  LoginPayload, VerifyLoginPayloadParams } from 'thirdweb/auth';
import { ApiDtoMetadata } from '../swagger/dto-metadata.decorator';
import { ApiProperty } from '@nestjs/swagger';

@ApiDtoMetadata({
    description: "Signature auth with your user web3 account of the application",
    title: "Web3 Signature Auth",
    group: "Shared"
})
export class AuthThirdWebVerifyPayloadDto implements VerifyLoginPayloadParams {
    @ApiProperty({
        title: "Signature",
        description: "A valid hexadecimal string representing the signature, starting with '0x'.",
        example: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
        type: String,
    })
    // @IsString({message: "Error with signature"})
    // @Matches(/^0x[a-fA-F0-9]+$/, { message: "signature must be a valid hex string starting with 0x" })
    signature: `0x${string}` | string;

    @ApiProperty({
        title: "Payload",
        description: "The login payload object from thirdweb/auth, containing authentication details.",
        example: { address: "0x1234567890abcdef1234567890abcdef12345678", nonce: "exampleNonce" },
        type: Object,
    })
    // No validation for payload, as it's a complex object from thirdweb/auth
    payload: LoginPayload;
}

@ApiDtoMetadata({
    description: "Jwt auth created with your user web3 account of the application or mock (depends of the implementation)",
    title: "Verify JWT",
    group: "Shared"
})
export class AuthThirdWebVerifyJwtDto {
    @ApiProperty({
        title: "Token",
        description: "The JSON Web Token (JWT) used for authentication, generated or mocked based on the implementation.",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        type: String,
    })
    @IsString()
    token: string;
}