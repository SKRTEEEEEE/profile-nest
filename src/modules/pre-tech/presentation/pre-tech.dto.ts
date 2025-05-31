import { IsString } from "class-validator";
import { MongooseBase } from "src/shareds/pattern/infrastructure/types";
import { ApiProperty } from "@nestjs/swagger";

export class MongoosePreTechDto implements MongooseBase {
  @ApiProperty()
  @IsString()
  nameId: string;

  @ApiProperty()
  @IsString()
  nameBadge: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsString()
  web: string;

  // MongooseBase fields (if needed)
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}