import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TechForm } from "src/domain/entities/tech";
import { apiTechFormCategory, TechFormCategory } from "src/domain/entities/tech.type";
import { IntlDto } from "src/shareds/presentation/intl.dto";
import { ApiDtoMetadata } from "src/shareds/swagger/dto-metadata.decorator";

@ApiDtoMetadata({
    title: "TechForm",
    description: "Tech form data for update or create",
    group: "Tech",
})

export class TechFormDto implements TechForm{
    @IsString()
    nameId: string;
    @IsString()
    nameBadge: string;
    @IsString()
    color: string;
    @IsString()
    web: string;
    @IsNumber()
    preferencia: number;
    @IsNumber()
    experiencia: number;
    @IsNumber()
    afinidad: number;
    @IsString()
    @IsOptional()
    img: string | null;
    @ValidateNested()
    @Type(() => IntlDto)
    desc: IntlDto;
    @IsNumber()
    usoGithub: number;
    @IsOptional()
    @IsString()
    lengTo?: string | undefined;
    @IsOptional()
    @IsString()
    fwTo?: string | undefined;
    @ApiProperty(
       apiTechFormCategory
    )
    @IsEnum(TechFormCategory)
    category: TechFormCategory
}