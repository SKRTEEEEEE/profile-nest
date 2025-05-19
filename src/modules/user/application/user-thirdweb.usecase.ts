import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { AuthThirdwebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";
import { Injectable } from "@nestjs/common";
import { UserCreateUseCase, UserReadOneUseCase } from "./user.usecase";
import { UnauthorizedError } from "src/domain/flows/domain.error";



@Injectable()
export class UserThirdWebCreateUseCase<TDB> {
    constructor(
        private readonly userCreateRepository: UserCreateUseCase<TDB>,
        private readonly userReadOneRepository: UserReadOneUseCase<TDB>,
        private readonly authThirdwebRepository: AuthThirdwebRepo
    ) {}

    async create(payload: VerifyLoginPayloadParams): Promise<UserBase & TDB> {
        const verifiedPayload = await this.authThirdwebRepository.verifyPayload(payload);
        if (!verifiedPayload.valid) throw new UnauthorizedError("Payload not valid")
        let user = await this.userReadOneRepository.readByAddress(verifiedPayload.payload.address);
        if(!user) return await this.userCreateRepository.create({ address: verifiedPayload.payload.address as string, roleId: null, role: null, solicitud: null, img: null, email: null , isVerified: false});
        return user;
    }
}