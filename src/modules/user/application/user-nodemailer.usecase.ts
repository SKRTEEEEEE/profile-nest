import { Injectable } from "@nestjs/common";
import { EmailNodemailerRepository } from "src/shareds/nodemailer/email-nodemailer.repo";
import { UserReadByIdUseCase, UserUpdateByIdUseCase, UserUpdateUseCase } from "./user.usecase";
import { VerifyLoginPayloadParams } from "@thirdweb-dev/auth";
import { DatabaseFindError, SetEnvError } from "src/domain/flows/domain.error";

export type UserUpdateNodemailer<TDB> = {
    payload: VerifyLoginPayloadParams,
    formData: UserFormS&{ id: any }
}

@Injectable()
export class UserNodemailerUpdateUseCase<TDB> {
    constructor(
        private readonly nodemailerRepository: EmailNodemailerRepository,
        private readonly userUpdateByIdService: UserUpdateByIdUseCase<TDB>,
        private readonly userReadByIdService: UserReadByIdUseCase<TDB>
    ){}
    async update(
        userUpdateProps: UserUpdateNodemailer<TDB>
    ){  
        let verifyToken, verifyTokenExpire;
        const user = await this.userReadByIdService.readById(userUpdateProps.formData.id)
        if(!user)throw new DatabaseFindError({entitie: "user", optionalMessage: "Not found at search existing for update"})
        let isVerified = user.isVerified
        if(userUpdateProps.formData.email !== null && userUpdateProps.formData.email !== undefined && user.email !== userUpdateProps.formData.email ){
                const {hashedToken, expireDate} = this.nodemailerRepository.generateVerificationToken()
                verifyToken = hashedToken
                verifyTokenExpire = expireDate.toString()
                const base = process.env.NEXT_PUBLIC_BASE_URL
                if(!base)throw new SetEnvError("public base")
                const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?verifyToken=${verifyToken}&id=${userUpdateProps.formData.id}`;
                const html = this.nodemailerRepository.createVerificationEmail(verificationLink);
                await this.nodemailerRepository.sendMail({to: userUpdateProps.formData.email, subject: "Email Verification",html})
                isVerified = false
            }
        return await this.userUpdateByIdService.updateById({
            id: userUpdateProps.formData.id,
            updateData: { ...userUpdateProps.formData, verifyToken, verifyTokenExpire, isVerified }
        })
    }
}