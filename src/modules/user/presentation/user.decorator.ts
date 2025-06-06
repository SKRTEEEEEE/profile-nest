import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ApiSignAuthHeader } from 'src/shareds/signature-auth/presentation/api-sign-auth.decorator';
// import { UserLoginMockDto } from './user.dto';

export function ApiMockLoginBody(dto: Function) {
  if (process.env.JWT_STRATEGY === 'mock') {
    return applyDecorators(
      ApiBody({
        description: 'Solo requerido en modo mock. Address del usuario.',
        type: dto,
        required: true,
      })
    );
  } else {
    return applyDecorators(ApiSignAuthHeader())
  }
  // return applyDecorators();
}