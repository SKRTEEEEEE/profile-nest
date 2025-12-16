import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DBBase } from 'src/dynamic.types';
import { IntlDto } from 'src/shareds/presentation/intl.dto';
import { ApiDtoMetadata } from 'src/shareds/swagger/dto-metadata.decorator';
import { IntlBase } from '@skrteeeeee/profile-domain/dist/entities/intl.type';
import { TypeProject } from '@skrteeeeee/profile-domain/dist/entities/project.type';
import { ProjectBase } from '@skrteeeeee/profile-domain/dist/entities/project';


// DTO para TechProject
@ApiDtoMetadata({
  title: 'Tech Project',
  description: 'Technology used in a project with its metadata',
  group: 'Project',
})
export class TechProjectDto {
  @ApiProperty({
    title: 'Name ID',
    description: 'Unique identifier for the technology',
    example: 'react',
    type: String,
  })
  @IsString()
  nameId: string;

  @ApiProperty({
    title: 'Name Badge',
    description: 'Display name for the technology badge',
    example: 'React',
    type: String,
  })
  @IsString()
  nameBadge: string;

  @ApiProperty({
    title: 'Image',
    description: 'URL or path to the technology logo',
    example: 'https://reactjs.org/logo.png',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  img: string | null;

  @ApiProperty({
    title: 'Website',
    description: 'Official website of the technology',
    example: 'https://reactjs.org',
    type: String,
  })
  @IsString()
  web: string;

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Description',
    description: 'Internationalized description of the technology',
    type: IntlDto,
  })
  desc: IntlBase;

  @ApiProperty({
    title: 'Type',
    description: 'Categories that this technology belongs to',
    example: [TypeProject.Frontend],
    enum: TypeProject,
    isArray: true,
  })
  @IsEnum(TypeProject, { each: true })
  @IsArray()
  type: TypeProject[];

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Type Description',
    description: 'Internationalized description of the technology type',
    type: IntlDto,
  })
  typeDesc: IntlBase;

  @ApiProperty({
    title: 'Version',
    description: 'Version of the technology used in the project',
    example: '18.2.0',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  version: string | null;

  @ApiProperty({
    title: 'ID',
    description: 'Unique identifier assigned by the database',
    example: '665b1c2f8f1b2a0012a34567',
  })
  @IsString()
  id: string;
}

// DTO para TimeProject
@ApiDtoMetadata({
  title: 'Time Project',
  description: 'Timeline entry for a project milestone or phase',
  group: 'Project',
})
export class TimeProjectDto {
  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Title',
    description: 'Title of the timeline entry',
    type: IntlDto,
  })
  title: IntlBase;

  @ApiProperty({
    title: 'Date',
    description: 'Date of the milestone in ISO format',
    example: '2024-01-15',
    type: String,
  })
  @IsString()
  date: string;

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Description',
    description: 'Description of what happened at this timeline point',
    type: IntlDto,
  })
  desc: IntlBase;

  @ApiProperty({
    title: 'Type',
    description: 'Project types associated with this timeline entry',
    example: [TypeProject.Frontend, TypeProject.Backend],
    enum: TypeProject,
    isArray: true,
  })
  @IsEnum(TypeProject, { each: true })
  @IsArray()
  type: TypeProject[];

  @ApiProperty({
    title: 'Technologies',
    description: 'Array of technology nameIds used in this phase',
    example: ['react', 'nodejs'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  techs: string[];

  @ApiProperty({
    title: 'ID',
    description: 'Unique identifier assigned by the database',
    example: '665b1c2f8f1b2a0012a34567',
  })
  @IsString()
  id: string;
}

// DTO para KeyProject
@ApiDtoMetadata({
  title: 'Key Project Feature',
  description: 'Key feature or highlight of a project',
  group: 'Project',
})
export class KeyProjectDto {
  @ApiProperty({
    title: 'Icon',
    description: 'Icon configuration for the key feature',
    example: {
      iconName: 'Zap',
      className: 'text-yellow-500',
    },
    type: 'object',
    properties: {
      iconName: { type: 'string' },
      className: { type: 'string' },
    },
  })
  @ValidateNested()
  icon: {
    iconName: string; // LucideIconNames
    className: string;
  };

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Title',
    description: 'Title of the key feature',
    type: IntlDto,
  })
  title: IntlBase;

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Description',
    description: 'Description of the key feature',
    type: IntlDto,
  })
  desc: IntlBase;

  @ApiProperty({
    title: 'ID',
    description: 'Unique identifier assigned by the database',
    example: '665b1c2f8f1b2a0012a34567',
  })
  @IsString()
  id: string;
}

// DTO base para Project
@ApiDtoMetadata({
  title: 'Project Base',
  description: 'Base structure for a project',
  group: 'Project',
})
class ProjectBaseDto {
  @ApiProperty({
    title: 'Name ID',
    description: 'Unique identifier for the project',
    example: 'portfolio-website',
    type: String,
  })
  @IsString()
  nameId: string;

  @ApiProperty({
    title: 'Open Source',
    description: 'URL to the open source repository if applicable',
    example: 'https://github.com/user/project',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  openSource: string | null;

  @ApiProperty({
    title: 'Operative',
    description: 'URL to the live/operative version of the project',
    example: 'https://project.example.com',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  operative: string | null;

  @ApiProperty({
    title: 'Example',
    description: 'Whether this is an example/demo project',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  ejemplo: boolean;

  @ApiProperty({
    title: 'Image',
    description: 'URL or path to the project main image',
    example: 'https://example.com/project-image.png',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  image: string | null;

  @ApiProperty({
    title: 'Icon',
    description: 'Lucide icon name for the project',
    example: 'Code',
    type: String,
  })
  @IsString()
  icon: string; // LucideIconNames

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Title',
    description: 'Project title (internationalized)',
    type: IntlDto,
  })
  title: IntlBase;

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Description',
    description: 'Full project description (internationalized)',
    type: IntlDto,
  })
  desc: IntlBase;

  @ValidateNested()
  @Type(() => IntlDto)
  @ApiProperty({
    title: 'Short Description',
    description: 'Brief project description (internationalized)',
    type: IntlDto,
  })
  lilDesc: IntlBase;

  @ValidateNested({ each: true })
  @Type(() => TimeProjectDto)
  @ApiProperty({
    title: 'Timeline',
    description: 'Project timeline with milestones',
    type: [TimeProjectDto],
  })
  @IsArray()
  time: TimeProjectDto[];

  @ValidateNested({ each: true })
  @Type(() => KeyProjectDto)
  @ApiProperty({
    title: 'Key Features',
    description: 'Key features and highlights of the project',
    type: [KeyProjectDto],
  })
  @IsArray()
  keys: KeyProjectDto[];

  @ValidateNested({ each: true })
  @Type(() => TechProjectDto)
  @ApiProperty({
    title: 'Technologies',
    description: 'Technologies used in the project',
    type: [TechProjectDto],
  })
  @IsArray()
  techs: TechProjectDto[];
}

// DTO completo de Project con campos de base de datos
@ApiDtoMetadata({
  title: 'Project',
  description: 'Complete project data with database fields',
  group: 'Project',
})
export class ProjectDto extends ProjectBaseDto implements DBBase ,ProjectBase {
  @ApiProperty({
    title: 'ID',
    description: 'Unique identifier assigned by the database (MongoDB ObjectId)',
    example: '665b1c2f8f1b2a0012a34567',
  })
  @IsString()
  id: string;

  @ApiProperty({
    title: 'Created At',
    description: 'ISO date string indicating when the record was created',
    example: '2024-05-31T12:34:56.789Z',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    title: 'Updated At',
    description: 'ISO date string indicating when the record was last updated',
    example: '2024-06-01T09:00:00.000Z',
  })
  @IsString()
  updatedAt: string;
}

// DTO para formulario de creación
@ApiDtoMetadata({
  title: 'Project Form',
  description: 'Form data for creating a new project',
  group: 'Project',
})
export class ProjectFormDto extends ProjectBaseDto {}

// DTO para formulario de actualización (campos opcionales)
@ApiDtoMetadata({
  title: 'Project Form Optional',
  description: 'Form data for updating an existing project',
  group: 'Project',
})
export class ProjectFormDtoOptional extends PartialType(ProjectFormDto) {}