// import { TechBase } from "src/domain/entities/tech";

import { DBBase } from '@/dynamic.types';
import { CRUI } from '@/shareds/pattern/application/interfaces/cru';
import { DeleteProps } from '@/shareds/pattern/application/interfaces/delete';
import { Leng, LengBase, TechBase, TechForm } from 'src/domain/entities/tech';
import { MongooseBase } from 'src/shareds/pattern/infrastructure/types/mongoose';

export interface TechRepository extends CRUI<LengBase> {
  read(filter?: Partial<LengBase & DBBase>): Promise<Array<Leng>>;
  updateByForm(
    updateData: Partial<TechForm>,
  ): Promise<(LengBase & DBBase) | undefined>;
  updateByNameId(
    nameId: string,
    updateData: Partial<LengBase>,
  ): Promise<(LengBase & DBBase) | undefined | null>;
  delete(filter: DeleteProps<LengBase>): Promise<LengBase & DBBase>;
  readOne(filter: Record<string, any>): Promise<LengBase & DBBase>;
}
