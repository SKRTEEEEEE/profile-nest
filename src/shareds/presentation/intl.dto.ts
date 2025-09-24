import { IntlBase } from 'src/domain/entities/intl.type';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiDtoMetadata } from '../swagger/dto-metadata.decorator';

@ApiDtoMetadata({
  description:
    'Internationalization identifier for translations in multiple languages.',
  title: 'Internationalization',
  group: 'Shared',
})
export class IntlDto implements IntlBase {
  @ApiProperty({
    title: 'es - Español',
    description: 'The identifier for the message in Spanish.',
    example: 'Un texto en Español',
  })
  @IsString()
  es: string;

  @ApiProperty({
    title: 'en - English',
    description: 'The identifier for the message in English.',
    example: 'A text in English',
  })
  @IsString()
  en: string;

  @ApiProperty({
    title: 'ca - Català',
    description: 'The identifier for the message in Catalan.',
    example: 'Un text en Català',
  })
  @IsString()
  ca: string;

  @ApiProperty({
    title: 'de - Deutsch',
    description: 'The identifier for the message in German.',
    example: 'Ein Text auf Deutsch',
  })
  @IsString()
  de: string;
}
