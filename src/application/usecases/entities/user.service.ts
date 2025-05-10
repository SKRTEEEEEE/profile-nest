import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/application/interfaces/entities/user.interface";

// Toda la lógica ha de ir aquí, por mucho que se usen otros domains, COMO MUCHO PODEMOS TENER VARIOS 'USECASES' ->
/*
-> Para lo mas pequeño -> Como usecases granulares (solo utilizan un domain) 
                        o en el caso de agrupar por uso de domains y luego aplicar los 'servicios' (email, storage, auth, etc..) 
                        -> Le LLAMAREMOS 'service' 
                        -> app/usecases/entities/<entitie>.service.ts - <Entitie>Service
-> Para los usecases consumidos por los controllers -> Le LLAMAREMOS 'usecases' 
                                                    -> app/usecases/adapters/<entitie>.usecases.ts

*/


@Injectable()
export class UserService<
  TDBBase extends TDBBaseMockup,
  TReadMeta extends ReadMeta<UserBase, TDBBase, any, any, any>,
  TUpdateMeta extends UpdateMeta<UserBase, TDBBase, any, any, any>,
  TUpdateByIdMeta extends UpdateByIdMeta<UserBase, TDBBase, any, any>
> {
  private readonly userRepository: UserRepository<TDBBase, TUpdateByIdMeta, TUpdateMeta, TReadMeta>;

  constructor(
    userRepository: UserRepository<TDBBase, TUpdateByIdMeta, TUpdateMeta, TReadMeta>
  ) {
    this.userRepository = userRepository;
  }
  async create(data: Omit<UserBase, "id">): Promise<UserBase & TDBBase> {
    return await this.userRepository.create(data);
  }
    async read(props: ReadProps<UserBase, TReadMeta>): Promise<UserBase[]> {
        return await this.userRepository.read(props);
    }
    async readById(id: TDBBase["id"]): Promise<UserBase & TDBBase> {
        return await this.userRepository.readById(id);
    }
    async readByAddress(address: string): Promise<UserBase & TDBBase> {
        return await this.userRepository.readByAddress(address);
    }
    async update(props: UpdateProps<UserBase, TUpdateMeta>): Promise<UserBase> {
        return await this.userRepository.update(props);
    }
    async updateById(props: UpdateByIdProps<UserBase, TUpdateByIdMeta>): Promise<UserBase & TDBBase> {
        return await this.userRepository.updateById(props);
    }
    async deleteById(props: DeleteByIdProps<TDBBase>): Promise<UserBase & TDBBase> {
        return await this.userRepository.deleteById(props);
    }
}
