import { Injectable, Inject } from "@nestjs/common";
import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";
import { UserInterface } from "./user.interface";
import { USER_REPOSITORY } from "src/modules/tokens";

@Injectable()
export class UserCreateUseCase<TDB> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>,
    ) {}

    async create(props: CreateProps<UserBase>): Promise<UserBase & TDB> {
        return await this.userRepository.create(props);
    }
}

@Injectable()
export class UserReadOneUseCase<TDB> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ){}
    
    async readOne(filter: Record<string, any>){
        return this.userRepository.readOne(filter)
    }
    
    async readByAddress(address: string){
        const debug = await this.userRepository.readOne( { "address": address } )
        return debug
    }
}

@Injectable()
export class UserReadUseCase<TDB> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ) {}

    async read(filter?: Partial<UserBase&TDB>): Promise<(UserBase & TDB)[]> {
        return await this.userRepository.read(filter);
    }
}

@Injectable()
export class UserReadByIdUseCase<TDB> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ) {}

    async readById(id: string): ReadByIdRes<UserBase, TDB> {
        return await this.userRepository.readById(id);
    }
}

@Injectable()
export class UserUpdateUseCase<TDB>  {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ) {}

    async update(filter:Record<string,any>, options: Record<string,any>) {
        return await this.userRepository.update(filter, options);
    }
}

@Injectable()
export class UserUpdateByIdUseCase<TDB>  {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ) {}

    async updateById(props: UpdateByIdProps<UserBase>): Promise<UserBase & TDB> {
        return await this.userRepository.updateById(props);
    }
}

@Injectable()
export class UserDeleteByIdUseCase<TDB> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ) {}
    
    async deleteById(props: DeleteByIdProps<TDB>): DeleteByIdRes<UserBase, TDB>{
        return this.userRepository.deleteById(props)
    }
}

@Injectable()
export class UserVerifyEmailUseCase<TDB> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserInterface<TDB>
    ) {}
    
    async verifyEmail(props: {id:string, verifyToken:string}): Promise<UserBase & TDB> {
        const user = await this.userRepository.readById(props.id);
        if (!user) {
            throw createDomainError(ErrorCodes.DATABASE_FIND, UserVerifyEmailUseCase, 'readById', undefined, { shortDesc: 'verifyEmail' })
        } 
        if (user.verifyToken !== props.verifyToken) {
            throw createDomainError(ErrorCodes.UNAUTHORIZED_ACTION, UserVerifyEmailUseCase, 'verifyEmail', "tryAgainOrContact", {desc:{
                es: 'Error al validar el token de correo electrónico',
                en: 'Error at validate email token',
                ca: "Error en validar el token de correu electrònic",
                de: 'Fehler beim Überprüfen des E-Mail-Tokens'
            }});
        }
        if (user.verifyTokenExpire && new Date(user.verifyTokenExpire) <= new Date()) {
            throw createDomainError(ErrorCodes.UNAUTHORIZED_ACTION, UserVerifyEmailUseCase, 'verifyEmail', "tryAgainOrContact",{shortDesc:'Error with token time',desc: {
                es: 'El tiempo de verificación ha trascurrido',
                en: 'Verification time has elapsed',
                ca: 'El temps de verificació ha transcorregut',
                de: 'Die Überprüfungszeit ist abgelaufen'
            }});
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpire = undefined;
        // ⚠️‼️ Esta parte en el futuro sera un botón de "subscripción"

        const sUser = await this.userRepository.updateById({id: (user as any).id, updateData:user})
        if(!sUser) throw createDomainError(ErrorCodes.DATABASE_ACTION, UserVerifyEmailUseCase, 'updateById')
        return sUser;
    }
}