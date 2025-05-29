import { IntlBase } from "src/domain/entities/intl.type";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiDtoMetadata } from "../swagger/dto-metadata.decorator";

@ApiDtoMetadata({
    description: 'A DTO representing an internationalization identifier for translations in multiple languages.',
    title: 'Internationalization',
    group: 'Shared'
})
export class IntlDto implements IntlBase {
    @ApiProperty({
        title: "test",
        description: 'The identifier for the message in Spanish.',
        example: 'Un texto en Español',
    })
    @IsString()
    es: string;
@ApiProperty({
        description: 'The identifier for the message in Spanish.',
        example: 'Un texto en Español',
    })
    @IsString()
    en: string;
@ApiProperty({
        description: 'The identifier for the message in Spanish.',
        example: 'Un texto en Español',
    })
    @IsString()
    ca: string;
@ApiProperty({
        description: 'The identifier for the message in Spanish.',
        example: 'Un texto en Español',
    })
    @IsString()
    de: string;
}