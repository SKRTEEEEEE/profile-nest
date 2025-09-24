import { IsString } from 'class-validator';
import { MongooseBase } from 'src/shareds/pattern/infrastructure/types/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseDto } from 'src/shareds/presentation/db.dto';
import { ApiDtoMetadata } from 'src/shareds/swagger/dto-metadata.decorator';

export class PreTechBaseDto implements PreTechBase {
  @ApiProperty({
    title: 'Name ID',
    description: 'Unique identifier for the technology.',
    example: 'react',
  })
  @IsString()
  nameId: string;

  @ApiProperty({
    title: 'Name Badge',
    description: 'Display name in SimpleIcons library for the technology.',
    example: 'React.js',
  })
  @IsString()
  nameBadge: string;

  @ApiProperty({
    title: 'Color',
    description:
      'Color associated with the technology, in hexadecimal format without hashtag (#).',
    example: '61DAFB',
  })
  @IsString()
  color: string;

  @ApiProperty({
    title: 'Website',
    description: 'Official website URL for the technology.',
    example: 'https://reactjs.org',
  })
  @IsString()
  web: string;
}
@ApiDtoMetadata({
  title: 'Pre Tech',
  description: 'Available techs for use in the app with all functionalities',
  group: 'Pre Tech',
})
export class PreTechDto
  extends PreTechBaseDto
  implements PreTechBase, MongooseBase
{
  @ApiProperty({
    title: 'ID',
    description:
      'Unique identifier assigned by the database (MongoDB ObjectId).',
    example: '665b1c2f8f1b2a0012a34567',
  })
  @IsString()
  id: string;

  @ApiProperty({
    title: 'Created At',
    description: 'ISO date string indicating when the record was created.',
    example: '2024-05-31T12:34:56.789Z',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    title: 'Updated At',
    description: 'ISO date string indicating when the record was last updated.',
    example: '2024-06-01T09:00:00.000Z',
  })
  @IsString()
  updatedAt: string;
}
