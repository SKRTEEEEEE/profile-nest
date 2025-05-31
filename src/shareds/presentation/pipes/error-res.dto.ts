import { ApiProperty } from '@nestjs/swagger';
import { DomainError } from 'src/domain/flows/domain.error';
import { ErrorCodes } from 'src/domain/flows/error.codes';
import { BaseFlow } from 'src/domain/flows/main.flow';
import { ErrorAppCodes } from 'src/dynamic.types';

export class ErrorResponseDto 
// implements Omit<DomainError> 
implements BaseFlow
{
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 'DATABASE ACTION' }) //ToDo - swagger enum
  type: ErrorCodes;

  @ApiProperty({ example: 'Action: update in Database doesn\'t worked' })
  message: string;

  @ApiProperty({ example: 1712345678901 })
  timestamp: number;

  @ApiProperty({ example: { entitie: 'User' }, required: false })
  meta?: Record<string, any>;

  @ApiProperty({ example: 500 })
  statusCode: number;
}