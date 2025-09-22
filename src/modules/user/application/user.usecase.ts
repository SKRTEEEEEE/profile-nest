import { Injectable } from "@nestjs/common";
import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";
import { PersistedEntity } from "src/shareds/pattern/application/interfaces/adapter.type";
import { CRRUUDIdRepository } from "src/shareds/pattern/application/usecases/crruud-id.interface";
import { ReadOneRepository } from "src/shareds/pattern/application/usecases/read-one.interface";

@Injectable()
export class UserCreateUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>,
        
    ) {}

    async create(props: CreateProps<UserBase>): Promise<UserBase & TDB> {
        
        return await this.crruudRepository.create(props);
    }
}

@Injectable()
export class UserReadOneUseCase<TDB> {
    constructor(
        private readonly readOneRepository: ReadOneRepository<UserBase, TDB>
    ){}
    async readOne(props: ReadOneProps<UserBase, TDB>){
        return this.readOneRepository.readOne(props)
    }
    async readByAddress(address: string){
        const debug = await this.readOneRepository.readOne({ filter: { "address": address } })
        return debug
    }
}


@Injectable()
export class UserReadUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async read(filter?: ReadProps<UserBase, TDB>): Promise<(UserBase & TDB)[]> {
        return await this.crruudRepository.read(filter);
    }
}
@Injectable()
export class UserReadByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async readById(id: ReadByIdProps<TDB>): ReadByIdRes<UserBase, TDB> {
        return await this.crruudRepository.readById(id);
    }
}
@Injectable()
export class UserUpdateUseCase<TDB> implements UpdateI<UserBase, TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async update(props: UpdateProps<UserBase, TDB>): UpdateRes<UserBase, TDB> {
        return await this.crruudRepository.update(props);
    }
}
@Injectable()
export class UserUpdateByIdUseCase<TDB>  {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}

    async updateById(props: UpdateByIdProps<UserBase, TDB>): Promise<UserBase & TDB> {
        return await this.crruudRepository.updateById(props);
    }
}
@Injectable()
export class UserDeleteByIdUseCase<TDB> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}
    async deleteById(props: DeleteByIdProps<TDB>): DeleteByIdRes<UserBase, TDB>{
        return this.crruudRepository.deleteById(props)
    }
}
@Injectable()
export class UserVerifyEmailUseCase<TDB extends PersistedEntity = PersistedEntity> {
    constructor(
        private readonly crruudRepository: CRRUUDIdRepository<UserBase, TDB>
    ) {}
    async verifyEmail(props: {id:string, verifyToken:string}): Promise<UserBase & TDB> {
        const user = await this.crruudRepository.readById(props.id as ReadByIdProps<TDB>);
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

    const sUser = await this.crruudRepository.updateById({id: user.id, updateData:user})
    if(!sUser) throw createDomainError(ErrorCodes.DATABASE_ACTION, UserVerifyEmailUseCase, 'updateById')
    return sUser;
    }
}