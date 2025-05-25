```ts
import { Injectable } from "@nestjs/common";
import { AuthThirdwebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";
import { UserDeleteByIdUseCase, UserReadByIdUseCase, UserReadOneUseCase, UserUpdateByIdUseCase, UserUpdateUseCase } from "./user.usecase";
import { RoleCreateUseCase, RoleDeleteByIdUseCase } from "src/modules/role/application/role.usecase";
import { LoginPayload } from "thirdweb/auth";
import { DatabaseFindError, UnauthorizedError } from "src/domain/flows/domain.error";
import { RoleType } from "src/domain/entities/role.type";
import { PersistedEntity } from "src/shareds/pattern/application/interfaces/adapter.type";


export type UserRoleThirdWebDeleteProps ={
    payload: {
  signature: `0x${string}`;
  payload: LoginPayload;
}, id: string, address: string
}
//delete
@Injectable()
export class UserRoleThirdWebDeleteUseCase<TDB> {
    constructor(
        private readonly authThirdWebRepository: AuthThirdwebRepo,
        private readonly userDeleteByIdService: UserDeleteByIdUseCase<TDB>,
        private readonly userReadByIdService: UserReadByIdUseCase<TDB>,
        private readonly roleDeleteByIdService: RoleDeleteByIdUseCase<TDB>
    ){}
    async deleteById(props: {payload: {
  signature: `0x${string}`;
  payload: LoginPayload;
}, id: ReadByIdProps<TDB>, address: string}){
    const v = await this.authThirdWebRepository.verifyPayload(props.payload)
  if (!v.valid) throw new UnauthorizedError("Error with payload auth")
  if (v.payload.address !== props.address) throw new UnauthorizedError("User only can delete her address")

  //deleteUser(id)
  const user = await this.userReadByIdService.readById(props.id)
  if (!user) throw new DatabaseFindError({optionalMessage:"User not found"})
  if (user.roleId !== null) {
    await this.roleDeleteByIdService.deleteById(user.roleId as DeleteByIdProps<TDB>);
  }
  await this.userDeleteByIdService.deleteById(props.id)
}
}
export type UserRoleThirdWebGiveRoleProps<TDB> = {payload: {
  signature: `0x${string}`;
  payload: LoginPayload;
}, id: ReadByIdProps<TDB>, solicitud: RoleType.ADMIN}
//giveRole
@Injectable()
export class UserRoleThirdwebGiveRoleUseCase<TDB extends PersistedEntity = PersistedEntity > {
    constructor(
        private readonly authThirdWebRepository: AuthThirdwebRepo,
        private readonly userReadByIdService: UserReadByIdUseCase<TDB>,
        private readonly userUpdateByIdService: UserUpdateByIdUseCase<TDB>,
        private readonly userReadOneService:
        UserReadOneUseCase<TDB>,
        private readonly roleCreateService: RoleCreateUseCase<TDB>,
    ){}
    async giveRole(props: {payload: {
  signature: `0x${string}`;
  payload: LoginPayload;
}, id: ReadByIdProps<TDB>, solicitud: RoleType.ADMIN}){
    const v = await this.authThirdWebRepository.verifyPayload(props.payload)
    if (!v.valid) throw new UnauthorizedError("payload auth")
      const signUser = await this.userReadOneService.readByAddress(props.payload.payload.address)
    if (!signUser) throw new DatabaseFindError({optionalMessage:"signer user not found"})
    if (signUser.role!=="ADMIN") throw new UnauthorizedError("Only admins")
        const user = await this.userReadByIdService.readById(props.id)
        if(!user)throw new DatabaseFindError({entitie:"user", optionalMessage: "User not found at give role action"})
    const createdRole = await this.roleCreateService.create({address: props.payload.payload.address,permissions: props.solicitud})
    await this.userUpdateByIdService.updateById({id: props.id, updateData:{
       address: user.address, roleId: createdRole.id,
      role: props.solicitud, solicitud: null, img: user.img, email: user.email, isVerified: user.isVerified
    }})
}
}
```