// import { RoleBase } from "src/domain/entities/role";
// import { CRRUDDRepository } from "../patterns/crrudd.interface";

import { RoleBase } from 'src/domain/entities/role';
import { DBBase } from 'src/dynamic.types';;

// export abstract class RoleRepository<TDB>
// extends CRRUDDRepository<RoleBase, TDB>
// {
// // implements
// //     CRUI<RoleBase, DBBase>,
// //     ReadI<RoleBase, DBBase>,
// //     DeleteByIdI<RoleBase, DBBase>,
// //     DeleteI<RoleBase, DBBase> {

// //     abstract create(data: CreateProps<RoleBase>): CreateRes<RoleBase, DBBase>;
// //     abstract read(filter?: ReadProps<RoleBase, DBBase>): ReadRes<RoleBase, DBBase>;
// //     abstract readById(id: ReadByIdProps<DBBase>): ReadByIdRes<RoleBase, DBBase>;
// //     abstract updateById(props: UpdateByIdProps<RoleBase, DBBase>): UpdateByIdRes<RoleBase, DBBase>;
// //     abstract deleteById(id: DeleteByIdProps<DBBase>): DeleteByIdRes<RoleBase, DBBase>;
// //     abstract delete(props: DeleteProps<RoleBase, DBBase>): DeleteRes<RoleBase, DBBase>;
// }
export interface RoleInterface extends CRUI<RoleBase, DBBase> {
  isAdmin(address: string): Promise<boolean>;
  read(filter?: Record<string, any>): EntitieArrayRes<RoleBase, DBBase>;
  deleteById(
    id: DeleteByIdProps<DBBase>,
  ): DeleteByIdRes<RoleBase, DBBase>;
  delete(
    props: DeleteProps<RoleBase, DBBase>,
  ): DeleteRes<RoleBase, DBBase>;
}
