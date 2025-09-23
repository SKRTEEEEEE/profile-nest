import { ApiProperty } from '@nestjs/swagger';
import { MongooseBase } from '../pattern/infrastructure/types/mongoose';
import { IsString } from 'class-validator';

export class DatabaseDto implements MongooseBase {
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
