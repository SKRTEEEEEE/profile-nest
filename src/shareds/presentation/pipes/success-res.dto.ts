import { ApiProperty } from '@nestjs/swagger';
import { BaseFlow } from 'src/domain/flows/main.flow';
import { ResCodes } from 'src/domain/flows/res.codes';

export class SuccessResponseDto<T> 
implements BaseFlow
{
  @ApiProperty({example: true})
  success: boolean;

  @ApiProperty({example: 'ENTITY_CREATED'}) //ToDo - enum swagger
  type: ResCodes;

  @ApiProperty({example: "The query was successful but there are no matching documents.", required: false })
  message: string | undefined | null;

  //ToDo - terminar ApiProperty
  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({required:true, example: 1748692875592})
  timestamp: number;

  @ApiProperty({ required: false })
  meta?: Record<string, any>;
}