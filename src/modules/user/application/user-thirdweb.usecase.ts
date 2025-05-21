import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { AuthThirdwebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";
import { Injectable } from "@nestjs/common";
import { UserCreateUseCase, UserReadOneUseCase } from "./user.usecase";
import { UnauthorizedError } from "src/domain/flows/domain.error";



@Injectable()
export class UserThirdWebCreateUseCase<TDB> {
    constructor(
        private readonly userCreateService: UserCreateUseCase<TDB>,
        private readonly userReadOneService: UserReadOneUseCase<TDB>,
        private readonly authThirdWebRepository: AuthThirdwebRepo
    ) {}

    async create(payload: VerifyLoginPayloadParams): Promise<UserBase & TDB> {
        console.log("creating", payload)
        const verifiedPayload = await this.authThirdWebRepository.verifyPayload(payload);
        if (!verifiedPayload.valid) throw new UnauthorizedError("Payload not valid")
        let user = await this.userReadOneService.readByAddress(verifiedPayload.payload.address);
        if(!user) return await this.userCreateService.create({ address: verifiedPayload.payload.address as string, roleId: null, role: null, solicitud: null, img: null, email: null , isVerified: false, nick: null});
        return user;
    }
}