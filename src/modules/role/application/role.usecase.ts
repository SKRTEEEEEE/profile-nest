import { Inject, Injectable } from '@nestjs/common';
import { RoleBase } from 'src/domain/entities/role';
import { RoleType } from 'src/domain/entities/role.type';
import { RoleInterface } from './role.interface';
import { MongooseBase } from 'src/shareds/pattern/infrastructure/types/mongoose';
import { ROLE_REPOSITORY } from 'src/modules/tokens';

@Injectable()
export class RoleCreateUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleInterface,
  ) {}

  async create(data: Omit<RoleBase, 'id'>): Promise<RoleBase & MongooseBase> {
    return await this.roleRepository.create(data);
  }
}

@Injectable()
export class RoleReadByIdUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleInterface,
  ) {}

  async readById(id: string): Promise<RoleBase & MongooseBase> {
    return await this.roleRepository.readById(id);
  }
}

@Injectable()
export class RoleReadUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleInterface,
  ) {}

  async read(
    filter?: Record<string, any>,
  ): Promise<(RoleBase & MongooseBase)[]> {
    return await this.roleRepository.read(filter);
  }

  async isAdmin(address: string): Promise<boolean> {
    // ✅ Ahora usa el método específico del repositorio
    return await this.roleRepository.isAdmin(address);
  }
}

@Injectable()
export class RoleUpdateByIdUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleInterface,
  ) {}

  async updateById(
    props: UpdateByIdProps<RoleBase>,
  ): Promise<RoleBase & MongooseBase> {
    return await this.roleRepository.updateById(props);
  }
}

@Injectable()
export class RoleDeleteByIdUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleInterface,
  ) {}

  async deleteById(id: string): Promise<RoleBase & MongooseBase> {
    return await this.roleRepository.deleteById(id);
  }
}

@Injectable()
export class RoleDeleteUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleInterface,
  ) {}

  async delete(
    props: DeleteProps<RoleBase, MongooseBase>,
  ): Promise<RoleBase & MongooseBase> {
    return await this.roleRepository.delete(props);
  }
}
