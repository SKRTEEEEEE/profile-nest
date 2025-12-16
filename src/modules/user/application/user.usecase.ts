import { Injectable, Inject } from '@nestjs/common';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';
import { UserInterface } from './user.interface';
import { USER_REPOSITORY } from 'src/modules/tokens';
import { DBBase } from 'src/dynamic.types';
import { CreateProps, UpdateByIdProps } from 'src/shareds/pattern/application/interfaces/cru';
import { UserVerification } from '../domain/user-verification';
import { UserBase } from '@skrteeeeee/profile-domain/dist/entities/user';

@Injectable()
export class UserCreateUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async create(props: CreateProps<UserBase>): Promise<UserBase & DBBase> {
    return await this.userRepository.create(props);
  }
}

@Injectable()
export class UserReadOneUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async readOne(filter: Record<string, any>) {
    return this.userRepository.readOne(filter);
  }

  async readByAddress(address: string) {
    const debug = await this.userRepository.readOne({ address: address });
    return debug;
  }
}

@Injectable()
export class UserReadUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async read(filter?: Partial<UserBase & DBBase>): Promise<(UserBase & DBBase)[]> {
    return await this.userRepository.read(filter);
  }
}

@Injectable()
export class UserReadByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async readById(id: string): Promise<UserBase & DBBase> {
    return await this.userRepository.readById(id);
  }
}

@Injectable()
export class UserUpdateUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async update(filter: Record<string, any>, options: Record<string, any>) {
    return await this.userRepository.update(filter, options);
  }
}

@Injectable()
export class UserUpdateByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async updateById(props: UpdateByIdProps<UserBase>): Promise<UserBase & DBBase> {
    return await this.userRepository.updateById(props);
  }
}

@Injectable()
export class UserDeleteByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async deleteById(props: string): Promise<UserBase & DBBase> {
    return this.userRepository.deleteById(props);
  }
}

@Injectable()
export class UserVerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserInterface,
  ) {}

  async verifyEmail(props: {
    id: string;
    verifyToken: string;
  }): Promise<UserBase & DBBase> {
    const user = await this.userRepository.readById(props.id);
    if (!user) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        UserVerifyEmailUseCase,
        'readById',
        undefined,
        { shortDesc: 'verifyEmail' },
      );
    }

    // Delegate business logic validation to Domain layer
    const verificationUpdates = UserVerification.verify(user, props.verifyToken);

    // ⚠️‼️ Esta parte en el futuro sera un botón de "subscripción"
    const sUser = await this.userRepository.updateById({
      id: (user as UserBase & DBBase).id,
      updateData: { ...user, ...verificationUpdates },
    });
    
    if (!sUser) {
      throw createDomainError(
        ErrorCodes.DATABASE_ACTION,
        UserVerifyEmailUseCase,
        'updateById',
      );
    }
    
    return sUser;
  }
}
