```ts
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { AuthThirdWebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";
import { Injectable } from "@nestjs/common";
import { UserCreateUseCase, UserReadOneUseCase } from "./user.usecase";
import { UnauthorizedError } from "src/domain/flows/domain.error";


// Es mejor si no se crea capa app para el shared importado, mejor no crear usecase, por lo tanto, crear la función en el controller
@Injectable()
export class UserThirdWebLoginUseCase<TDB> {
    constructor(
        private readonly userCreateService: UserCreateUseCase<TDB>,
        private readonly userReadOneService: UserReadOneUseCase<TDB>,
        private readonly authThirdWebRepository: AuthThirdWebRepo
    ) {}

    async login(payload: VerifyLoginPayloadParams): Promise<UserBase & TDB> {
        const verifiedPayload = await this.authThirdWebRepository.verifyPayload(payload);
        if (!verifiedPayload.valid) throw new UnauthorizedError("Payload not valid")
        let user = await this.userReadOneService.readByAddress(verifiedPayload.payload.address);
        if(!user) return await this.userCreateService.create({ address: verifiedPayload.payload.address as string, roleId: null, role: null, solicitud: null, img: null, email: null , isVerified: false, nick: null});
        return user;
    }
}
```