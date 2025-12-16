import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseFlow } from '@skrteeeeee/profile-domain/dist/flows/main.flow';
import { apiErrorCodes, ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';
import { ApiDtoMetadata } from 'src/shareds/swagger/dto-metadata.decorator';

@ApiDtoMetadata({
  title: 'Error Response',
  description: 'Standard error response structure for all endpoints in the app',
  group: 'Shared',
})
export class ErrorResponseDto implements BaseFlow {
  @ApiProperty({
    title: 'Success',
    description: 'Always false for error responses',
    example: false,
    default: false,
  })
  success: false;

  @ApiProperty(apiErrorCodes)
  @IsEnum(ErrorCodes)
  type: ErrorCodes;

  @ApiProperty({
    title: 'Error Message',
    description: 'Human-readable description of the error',
    example: "Action: update in Database didn't work",
  })
  message: string;

  @ApiProperty({
    title: 'Timestamp',
    description: 'Time when the error occurred (epoch ms)',
    example: 1712345678901,
  })
  timestamp: number;

  @ApiProperty({
    title: 'Meta',
    description: 'Extra data about the error (optional)',
    example: { string: 'any' },
    required: false,
  })
  meta?: Record<string, any>;

  @ApiProperty({
    title: 'HTTP Status Code',
    description: 'HTTP status code for the error',
    example: 500,
  })
  statusCode: number;
}
