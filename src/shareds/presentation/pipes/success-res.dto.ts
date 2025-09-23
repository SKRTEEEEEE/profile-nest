import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseFlow } from 'src/domain/flows/main.flow';
import { apiResCodes, ResCodes } from 'src/domain/flows/res.type';
import { ApiDtoMetadata } from 'src/shareds/swagger/dto-metadata.decorator';

@ApiDtoMetadata({
  title: 'Success Response',
  description:
    'Standard structure for successful responses in all endpoints of the app.',
  group: 'Shared',
})
export class SuccessResponseDto<T> implements BaseFlow {
  @ApiProperty({
    title: 'Success',
    description:
      'Indicates if the response is successful. Always true for successful responses.',
    example: true,
    default: true,
  })
  success: boolean;

  @ApiProperty(apiResCodes)
  @IsEnum(ResCodes)
  type: ResCodes;

  @ApiProperty({
    title: 'Message',
    description:
      'Optional message providing extra information about the operation result.',
    example: 'The query was successful but there are no matching documents.',
    required: false,
  })
  message: string | undefined | null;

  @ApiProperty({
    title: 'Data',
    description:
      'The main data returned by the endpoint. Its structure depends on the specific operation.',
    required: false,
  })
  data?: T;

  @ApiProperty({
    title: 'Timestamp',
    description:
      'Epoch timestamp (in milliseconds) indicating when the response was generated.',
    required: true,
    example: 1748692875592,
  })
  timestamp: number;

  @ApiProperty({
    title: 'Meta',
    description:
      'Optional extra metadata related to the response, useful for debugging or additional context.',
    required: false,
  })
  meta?: Record<string, any>;
}
