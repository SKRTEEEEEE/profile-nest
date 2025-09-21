import { Type } from "class-transformer";
import { IsEnum,  IsOptional,  IsString, Matches, ValidateNested } from "class-validator";
import { apiRoleType, RoleType } from "src/domain/entities/role.type";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { AuthThirdWebVerifyPayloadDto } from "src/shareds/thirdweb/auth-thirdweb.dto";
import { LoginPayload } from "thirdweb/auth";
import { UserNodemailerUpdateProps } from "../application/user-nodemailer.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { ApiDtoMetadata } from "src/shareds/swagger/dto-metadata.decorator";

//delete
// type UserRoleThirdWebDeleteProps = {
//     // payload: {
//     //     signature: `0x${string}` | string;
//     //     payload: LoginPayload;
//     // };
//     id: string;
//     address: string;
// };
// export class UserRoleThirdWebDeleteDto implements UserRoleThirdWebDeleteProps {
//     // @ValidateNested()
//     // @Type(() => AuthThirdWebVerifyPayloadDto)
//     // payload: AuthThirdWebVerifyPayloadDto;

//     @IsString()
//     id: string;

//     @IsString()
//     address: string;
// }
//give role
type UserRoleThirdWebGiveRoleProps = {
//     payload: {
//   signature: `0x${string}` | string;
//   payload: LoginPayload;
// }, 
id: ReadByIdProps<MongooseBase>, solicitud: RoleType
}
@ApiDtoMetadata({
    description: "Data necessary for give or request a user role",
    title: "User Manage Role",
    group: "User"
})
export class UserManageRoleDto implements UserRoleThirdWebGiveRoleProps {
    // @ValidateNested()
    // @Type(() => AuthThirdWebVerifyPayloadDto)
    // payload: AuthThirdWebVerifyPayloadDto;

    @ApiProperty({
        title: "ID",
        description: "Unique identifier assigned to a user by the database (MongoDB ObjectId).",
        example: "665b1c2f8f1b2a0012a34567"
    })
    @IsString()
    id: ReadByIdProps<MongooseBase>;

    @ApiProperty(apiRoleType)
    @IsEnum(RoleType)
    solicitud: RoleType;
}

export class UserUpdateSolicitudDto {
    @IsString()
    id: string;

    @IsEnum(RoleType)
    solicitud: RoleType;
}
@ApiDtoMetadata({
    title: "User Update",
    description: `Data used to update user information. Includes fields such as email, nickname, and profile image. The user ID is required; other fields are optional and can be provided as needed for partial updates.`,
    group: "User"
})
export class UserUpdateDto implements UserNodemailerUpdateProps {
    @ApiProperty({
        title: "User ID",
        description: "Unique identifier assigned to the user by the database (MongoDB ObjectId).",
        example: "665b1c2f8f1b2a0012a34567"
    })
    @IsString()
    id: string;

    @ApiProperty({
        title: "Email",
        description: "User's email address. Must be a valid email format. Optional for updates.",
        example: "user@email.com",
        required: false,
        nullable: true
    })
    @IsOptional()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    email?: string | null;

    @ApiProperty({
        title: "Nickname",
        description: "User's display name or nickname.",
        example: "john_doe"
    })
    @IsString()
    nick: string;

    @ApiProperty({
        title: "Profile Image",
        description: "URL or path to the user's profile image. Optional for updates.",
        example: "https://example.com/avatar.png",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    img: string | null;
}
export class UserVerifyEmailDto {
    // @IsString()
    // id: string;
    @IsString()
    token: string
} //To delete
@ApiDtoMetadata({
    description: "Address of the user to be logged. *This Body is only required in case of mock for facilitate not use ever the sign wallet payload*",
    title: "User Login Mock",
    group: "User"
})
export class UserLoginMockDto {
    @ApiProperty({
        title: "Wallet Address",
        description: "Blockchain wallet address of the user to be logged.",
        example: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst"
    })
    @IsString()
    address: string

    @ApiProperty({
        title: "Wallet password",
        description: "Blockchain wallet password of the user to be logged",
        example: "Im3l0nmu7k"
    })
    @IsString()
    password: string
}
@ApiDtoMetadata({
    description: "All info about User included the Database metadata",
    title: "User",
    group: "User"
})
export class UserDto extends UserUpdateDto implements User<MongooseBase> {
    @ApiProperty({
        title: "Wallet Address",
        description: "Blockchain wallet address of the user.",
        example: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst"
    })
    @IsString()
    address: string;

    @ApiProperty({
        title: "Role ID",
        description: "ID of the user's role in the system.",
        example: "665b1c2f8f1b2a0012a34567",
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    roleId: string | null;

    @ApiProperty(apiRoleType)
    @IsOptional()
    @IsEnum(RoleType)
    role: RoleType | null;

    @ApiProperty({...apiRoleType, description: "Role type permission that User required"})
    @IsOptional()
    @IsEnum(RoleType)
    solicitud: RoleType | null;

    @ApiProperty({
        title: "Is Verified",
        description: "Indicates if the user's email is verified.",
        example: true
    })
    isVerified: boolean;

    @ApiProperty({
        title: "Verification Token",
        description: "Token used for email verification.",
        required: false,
        example: "abcdef123456",
        nullable: true
    })
    @IsOptional()
    @IsString()
    verifyToken?: string | undefined;

    @ApiProperty({
        title: "Verification Token Expiry",
        description: "Expiration date/time for the verification token.",
        required: false,
        example: "2024-07-01T12:00:00.000Z",
        nullable: true
    })
    @IsOptional()
    @IsString()
    verifyTokenExpire?: string | undefined;

    @ApiProperty({
        title: "Payment ID",
        description: "ID of the user's payment method or transaction.",
        required: false,
        example: "pay_1234567890",
        nullable: true
    })
    @IsOptional()
    @IsString()
    paymentId?: string | undefined;

    @ApiProperty({
        title: "Created At",
        description: "ISO date string indicating when the user was created.",
        example: "2024-05-31T12:34:56.789Z"
    })
    @IsString()
    createdAt: string;

    @ApiProperty({
        title: "Updated At",
        description: "ISO date string indicating when the user was last updated.",
        example: "2024-06-01T09:00:00.000Z"
    })
    @IsString()
    updatedAt: string;
}