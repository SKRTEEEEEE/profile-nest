import { ApiDtoMetadata } from 'src/shareds/swagger/dto-metadata.decorator';

@ApiDtoMetadata({
  description: 'Used for response without data value',
  title: 'Void Response',
  group: 'Shared',
})
export class VoidDto {}
