import { DBBase } from 'src/dynamic.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DatabaseDto implements DBBase {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  createdAt: string;

  @ApiProperty()
  @IsString()
  updatedAt: string;
}
