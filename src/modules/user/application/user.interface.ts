import { DBBase } from "src/dynamic.types";
import { CRUI } from "src/shareds/pattern/application/interfaces/cru";

export interface UserInterface extends CRUI<UserBase> {
  read(filter?: Partial<UserBase & DBBase>): Promise<(UserBase & DBBase)[]>;
  update(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<UserBase & DBBase>;
  deleteById(id: string): Promise<UserBase & DBBase>;
  readByAddress(address: string): Promise<UserBase & DBBase>;
  readOne(filter: Record<string, any>): Promise<UserBase & DBBase>;
}
