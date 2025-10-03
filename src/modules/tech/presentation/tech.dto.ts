import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  FullTechData,
  FwBase,
  LengBase,
  TechBase,
  TechForm,
} from 'src/domain/entities/tech';
import {
  apiTechFormCategory,
  TechFormCategory,
} from 'src/domain/entities/tech.type';
import { PreTechBaseDto } from 'src/modules/pre-tech/presentation/pre-tech.dto';
import { DBBase } from 'src/dynamic.types';;
import { IntlDto } from 'src/shareds/presentation/intl.dto';
import { ApiDtoMetadata } from 'src/shareds/swagger/dto-metadata.decorator';

@ApiDtoMetadata({
  title: 'Tech Base',
  description: 'Tech base body struct, used for extend',
  group: 'Tech',
})
class TechBaseDto extends PreTechBaseDto implements TechBase {
  @ApiProperty({
    title: 'Preference',
    description: 'Preference level (order) for the technology (numeric value).',
    example: 5,
    type: Number,
  })
  @IsNumber()
  preferencia: number;

  @ApiProperty({
    title: 'Experience',
    description: 'Level of experience with the technology (numeric value).',
    example: 59,
    type: Number,
  })
  @IsNumber()
  experiencia: number;

  @ApiProperty({
    title: 'Affinity',
    description:
      'Affinity or compatibility level with the technology (numeric value).',
    example: 70,
    type: Number,
  })
  @IsNumber()
  afinidad: number;

  @ApiProperty({
    title: 'Image',
    description:
      'URL or path to an image representing the technology (optional).',
    example: 'https://reactjs.org/logo.png',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  img: string | null;

  @ValidateNested()
  @Type(() => IntlDto)
  desc: IntlDto;

  @ApiProperty({
    title: 'GitHub Usage',
    description:
      'Level of usage or activity on GitHub for the technology (numeric value).',
    example: 5.1,
    type: Number,
  })
  @IsNumber()
  usoGithub: number;
}
@ApiDtoMetadata({
  title: 'Tech Form',
  description:
    'Form data for create a tech (identify ever user used technology)',
  group: 'Tech',
})
export class TechFormDto extends TechBaseDto implements TechForm {
  @ApiProperty({
    title: 'Related Language',
    description:
      'Programming language related to the technology (only if you are creating a TechFormCategory.FW).',
    example: 'JavaScript',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  lengTo?: string | undefined;

  @ApiProperty({
    title: 'Related Framework',
    description: 'Framework related to the technology (optional).',
    example: 'Next.js',
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
@ApiDtoMetadata({
  title: 'Tech Form Optional',
  description:
    'Form data for update a tech (identify ever user used technology)',
  group: 'Tech',
})
export class TechFormDtoOptional extends PartialType(TechFormDto) {}
@ApiDtoMetadata({
  title: 'Language',
  description:
    'Represents a programming language with its associated frameworks, libs and metadata.',
  group: 'Tech',
})
export class LangDto extends TechBaseDto implements LengBase, DBBase {
  @ApiProperty({
    title: 'Frameworks',
    description: 'List of frameworks associated with this language.',
    type: () => [TechBaseDto], // Puedes crear un FwDto si quieres más detalle
    required: false,
    example: [
      {
        nameId: 'nextjs',
        nameBadge: 'Next.js',
        color: '000000',
        web: 'https://nextjs.org',
        preferencia: 1,
        experiencia: 40,
        afinidad: 85,
        img: 'https://nextjs.org/static/favicon/favicon.ico',
        desc: {
          en: 'React framework for production.',
          es: 'Framework de React para producción.',
        },
        usoGithub: 8.5,
      },
    ],
  })
  frameworks?: FwBase[] | undefined;
  @ApiProperty({
    title: 'ID',
    description:
      'Unique identifier assigned by the database (MongoDB ObjectId).',
    example: '665b1c2f8f1b2a0012a34567',
  })
  id: string;
  @ApiProperty({
    title: 'Created At',
    description: 'ISO date string indicating when the record was created.',
    example: '2024-05-31T12:34:56.789Z',
  })
  createdAt: string;
  @ApiProperty({
    title: 'Updated At',
    description: 'ISO date string indicating when the record was last updated.',
    example: '2024-06-01T09:00:00.000Z',
  })
  updatedAt: string;
}

@ApiDtoMetadata({
  title: 'Full Tech Data',
  description:
    'Represents a technology with all its metadata, including affinity, experience, usage, and database fields.',
  group: 'Tech',
})
export class FullTechDataDto
  extends TechBaseDto
  implements FullTechData, DBBase
{
  @ApiProperty({
    title: 'Affinity Value',
    description:
      'Representation of the affinity value for the technology. Indicated by user.',
    example: '82.5',
  })
  valueAfin: string;

  @ApiProperty({
    title: 'Experience Value',
    description:
      'Representation of the experience value for the technology. Indicated by user.',
    example: '70',
  })
  valueExp: string;

  @ApiProperty({
    title: 'Is Framework',
    description:
      'Indicates if the technology is a framework and the language that he pertains.',
    example: 'TypeScript',
    required: false,
  })
  isFw?: string;

  @ApiProperty({
    title: 'Is Library',
    description:
      'Indicates if the technology is a library and the framework that he pertains.',
    example: 'false',
    required: false,
  })
  isLib?: string;

  @ApiProperty({
    title: 'Usage Value',
    description: 'Representation of the usage value for the technology.',
    example: '3.72',
  })
  valueUso: string;

  @ApiProperty({
    title: 'ID',
    description:
      'Unique identifier assigned by the database (MongoDB ObjectId).',
    example: '665b1c2f8f1b2a0012a34567',
  })
  id: string;

  @ApiProperty({
    title: 'Created At',
    description: 'ISO date string indicating when the record was created.',
    example: '2024-05-31T12:34:56.789Z',
  })
  createdAt: string;

  @ApiProperty({
    title: 'Updated At',
    description: 'ISO date string indicating when the record was last updated.',
    example: '2024-06-01T09:00:00.000Z',
  })
  updatedAt: string;
}
@ApiDtoMetadata({
  title: 'Tech',
  description: 'Tech data response',
  group: 'Tech',
})
export class TechDto extends TechBaseDto implements TechBase, DBBase {
  @ApiProperty({
    title: 'ID',
    description:
      'Unique identifier assigned by the database (MongoDB ObjectId).',
    example: '665b1c2f8f1b2a0012a34567',
  })
  id: string;
  @ApiProperty({
    title: 'Created At',
    description: 'ISO date string indicating when the record was created.',
    example: '2024-05-31T12:34:56.789Z',
  })
  createdAt: string;
  @ApiProperty({
    title: 'Updated At',
    description: 'ISO date string indicating when the record was last updated.',
    example: '2024-06-01T09:00:00.000Z',
  })
  updatedAt: string;
}
