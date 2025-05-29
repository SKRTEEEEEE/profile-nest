import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TechForm } from "src/domain/entities/tech";
import { apiTechFormCategory, TechFormCategory } from "src/domain/entities/tech.type";
import { IntlDto } from "src/shareds/presentation/intl.dto";
import { ApiDtoMetadata } from "src/shareds/swagger/dto-metadata.decorator";

// 🖊️🚧 HAS DE TERMINAR LAS API PROPERTY
@ApiDtoMetadata({
    title: "Tech Form",
    description: "Tech form data for update or create",
    group: "Tech",
})
export class TechFormDto implements TechForm {
    @ApiProperty({
        title: "Name ID",
        description: "Unique identifier for the technology.",
        example: "react",
        type: String,
    })
    @IsString()
    nameId: string;

    @ApiProperty({
        title: "Name Badge",
        description: "Display name or badge for the technology.",
        example: "React.js",
        type: String,
    })
    @IsString()
    nameBadge: string;

    @ApiProperty({
        title: "Color",
        description: "Color associated with the technology, typically in hexadecimal format.",
        example: "#61DAFB",
        type: String,
    })
    @IsString()
    color: string;

    @ApiProperty({
        title: "Website",
        description: "Official website URL for the technology.",
        example: "https://reactjs.org",
        type: String,
    })
    @IsString()
    web: string;

    @ApiProperty({
        title: "Preference",
        description: "Preference level for the technology (numeric value).",
        example: 8,
        type: Number,
    })
    @IsNumber()
    preferencia: number;

    @ApiProperty({
        title: "Experience",
        description: "Level of experience with the technology (numeric value).",
        example: 5,
        type: Number,
    })
    @IsNumber()
    experiencia: number;

    @ApiProperty({
        title: "Affinity",
        description: "Affinity or compatibility level with the technology (numeric value).",
        example: 7,
        type: Number,
    })
    @IsNumber()
    afinidad: number;

    @ApiProperty({
        title: "Image",
        description: "URL or path to an image representing the technology (optional).",
        example: "https://reactjs.org/logo.png",
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    img: string | null;

    // @ApiProperty({
    //     title: "Description",
    //     description: "Internationalized description of the technology in multiple languages.",
    //     // type: () => IntlDto,
    // })
    @ValidateNested()
    @Type(() => IntlDto)
    desc: IntlDto;

    @ApiProperty({
        title: "GitHub Usage",
        description: "Level of usage or activity on GitHub for the technology (numeric value).",
        example: 1000,
        type: Number,
    })
    @IsNumber()
    usoGithub: number;

    @ApiProperty({
        title: "Related Language",
        description: "Programming language related to the technology (only if you are creating a TechFormCategory.FW).",
        example: "JavaScript",
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString()
    lengTo?: string | undefined;

    @ApiProperty({
        title: "Related Framework",
        description: "Framework related to the technology (optional).",
        example: "Next.js",
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString()
    fwTo?: string | undefined;

    @ApiProperty(apiTechFormCategory)
    @IsEnum(TechFormCategory)
    category: TechFormCategory;
}