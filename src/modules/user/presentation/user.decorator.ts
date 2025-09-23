import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiSignAuthHeader } from 'src/shareds/signature-auth/presentation/api-sign-auth.decorator';
// import { UserLoginMockDto } from './user.dto';

export function ApiMockLoginBody(dto: Function) {
  if (process.env.JWT_STRATEGY === 'mock') {
    return applyDecorators(
      ApiBody({
        description: 'Solo requerido en modo mock. Address del usuario.',
        type: dto,
        required: true,
      }),
    );
  } else {
    return applyDecorators(ApiSignAuthHeader());
  }
  // return applyDecorators();
}

export function ApiLoginOperation() {
  const isMock = process.env.JWT_STRATEGY === 'mock';

  return ApiOperation({
    summary: '🆕 Create - Login user',
    description: `Login a user in the app.

- 🌐 **Public endpoint**: No authentication required.
- ➕ **Operation**: Generate required info with your unique address and create a new user if required or return the existing user.
${isMock ? '- 📝 **Request body** -> (only with) [JWT_STRATEGY -> mock]: `User Mock Login`. ' : ''}
- 📄 **Extra head -> (only with) [JWT_STRATEGY -> (default)]**: The payload of the user address signature.
- ✅ **Response**: Returns the user in the database.

Use this endpoint to initialize the app user.`,
  });
}
