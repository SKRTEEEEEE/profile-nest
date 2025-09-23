// import { RoleBase } from "src/domain/entities/role";
// import { CRRUDDRepository } from "../patterns/crrudd.interface";

import { RoleBase } from 'src/domain/entities/role';
import { MongooseBase } from 'src/shareds/pattern/infrastructure/types/mongoose';

// export abstract class RoleRepository<TDB>
// extends CRRUDDRepository<RoleBase, TDB>
// {
// // implements
// //     CRUI<RoleBase, MongooseBase>,
// //     ReadI<RoleBase, MongooseBase>,
// //     DeleteByIdI<RoleBase, MongooseBase>,
// //     DeleteI<RoleBase, MongooseBase> {

// //     abstract create(data: CreateProps<RoleBase>): CreateRes<RoleBase, MongooseBase>;
// //     abstract read(filter?: ReadProps<RoleBase, MongooseBase>): ReadRes<RoleBase, MongooseBase>;
// //     abstract readById(id: ReadByIdProps<MongooseBase>): ReadByIdRes<RoleBase, MongooseBase>;
// //     abstract updateById(props: UpdateByIdProps<RoleBase, MongooseBase>): UpdateByIdRes<RoleBase, MongooseBase>;
// //     abstract deleteById(id: DeleteByIdProps<MongooseBase>): DeleteByIdRes<RoleBase, MongooseBase>;
// //     abstract delete(props: DeleteProps<RoleBase, MongooseBase>): DeleteRes<RoleBase, MongooseBase>;
// }
export interface RoleInterface extends CRUI<RoleBase, MongooseBase> {
  isAdmin(address: string): Promise<boolean>;
  read(filter?: Record<string, any>): EntitieArrayRes<RoleBase, MongooseBase>;
  deleteById(
    id: DeleteByIdProps<MongooseBase>,
  ): DeleteByIdRes<RoleBase, MongooseBase>;
  delete(
    props: DeleteProps<RoleBase, MongooseBase>,
  ): DeleteRes<RoleBase, MongooseBase>;
}
