import { Global, Module } from '@nestjs/common';
import { RoleAuthUseCase } from 'src/shareds/role-auth/application/role-auth.usecase';

@Global() // Marca el módulo como global
@Module({
  providers: [RoleAuthUseCase],
  exports: [RoleAuthUseCase],
})
export class RoleAuthModule {}
