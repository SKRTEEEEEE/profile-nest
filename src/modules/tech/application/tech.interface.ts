// import { TechBase } from '@skrteeeeee/profile-domain/dist/entities/tech';

import { DBBase } from 'src/dynamic.types';
import { CRUI } from 'src/shareds/pattern/application/interfaces/cru';
import { DeleteProps } from 'src/shareds/pattern/application/interfaces/delete';
import { FullTechData, LengBase, LibBase, TechBase, TechForm } from '@skrteeeeee/profile-domain/dist/entities/tech';

export type { LengBase, LibBase, TechBase, FullTechData, TechForm };

export type Fw = TechBase & DBBase & {
  librerias?: (LibBase&DBBase)[];
}
export type Leng = TechBase & DBBase & {
  frameworks?: Fw[];
}

export type ReadAllFlattenTechsRes = {
  techs: (LengBase & DBBase)[];
  flattenTechs: FullTechData[];
  dispoFw: { name: string }[];
  dispoLeng: { name: string }[];
};

export interface TechInterface extends CRUI<LengBase> {
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
