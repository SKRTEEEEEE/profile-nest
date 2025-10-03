// import { RoleBase } from "src/domain/entities/role";
// import { CRRUDDRepository } from "../patterns/crrudd.interface";

import { CRUI } from 'src/shareds/pattern/application/interfaces/cru';
import { DeleteProps } from 'src/shareds/pattern/application/interfaces/delete';
import { RoleBase } from 'src/domain/entities/role';
import { DBBase } from 'src/dynamic.types';;

export interface RoleInterface extends CRUI<RoleBase> {
  isAdmin(address: string): Promise<boolean>;
  read(filter?: Record<string, any>): Promise<Array<RoleBase&DBBase>>;
  deleteById(
    id: string
  ): Promise<RoleBase & DBBase>;
  delete(
    props: DeleteProps<RoleBase>,
  ): Promise<Array<RoleBase&DBBase>>;
}
