
import { Injectable } from "@nestjs/common";
import { EmailNodemailerRepo } from "src/shareds/nodemailer/email-nodemailer.repo";
import { UserReadByIdUseCase, UserUpdateByIdUseCase, UserUpdateUseCase } from "./user.usecase";
import { VerifyLoginPayloadParams } from "@thirdweb-dev/auth";
import { DatabaseFindError, SetEnvError } from "src/domain/flows/domain.error";

export type UserNodemailerUpdateProps = 
    // payload: VerifyLoginPayloadParams,
    UserFormS&{ id: any }


@Injectable()
export class UserNodemailerUpdateUseCase<TDB> {
    constructor(
        private readonly nodemailerRepository: EmailNodemailerRepo,
        private readonly userUpdateByIdService: UserUpdateByIdUseCase<TDB>,
        private readonly userReadByIdService: UserReadByIdUseCase<TDB>
    ){}
    async update(
        userUpdateProps: UserNodemailerUpdateProps
    ){  
        let verifyToken, verifyTokenExpire;
        const user = await this.userReadByIdService.readById(userUpdateProps.id)
        if(!user)throw new DatabaseFindError({entitie: "user", optionalMessage: "Not found at search existing for update"})
        let isVerified = user.isVerified
        if(userUpdateProps.email !== null && userUpdateProps.email !== undefined && user.email !== userUpdateProps.email ){
                const {hashedToken, expireDate} = this.nodemailerRepository.generateVerificationToken()
                verifyToken = hashedToken
                verifyTokenExpire = expireDate.toString()
                const base = process.env.NEXT_PUBLIC_BASE_URL
                if(!base)throw new SetEnvError("public base")
                const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?verifyToken=${verifyToken}&id=${userUpdateProps.id}`;
                const html = this.nodemailerRepository.createVerificationEmail(verificationLink);
                await this.nodemailerRepository.sendMail({to: userUpdateProps.email, subject: "Email Verification",html})
                isVerified = false
            }
        return await this.userUpdateByIdService.updateById({
            id: userUpdateProps.id,
            updateData: { ...userUpdateProps, verifyToken, verifyTokenExpire, isVerified }
        })
    }
}
