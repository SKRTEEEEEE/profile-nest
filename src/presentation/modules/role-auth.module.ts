import { Global, Module } from "@nestjs/common";
import { RoleAuthService } from "src/application/usecases/shareds/role-auth.service";

@Global() // Marca el módulo como global
@Module({
  providers: [RoleAuthService],
  exports: [RoleAuthService],
})
export class RoleAuthModule {}