// import { TechBase } from "src/domain/entities/tech";

import { LengBase, TechBase, TechForm } from "src/domain/entities/tech";



export interface TechRepository<TDB>
    extends CRUI<LengBase, TDB> {
        read(filter?: Partial <LengBase &TDB>): Promise<Array<LengBase&TDB>>
        updateByForm(updateData: Partial<TechForm>): Promise<LengBase&TDB| undefined>
        updateByNameId(nameId:string,updateData: Partial<LengBase>): Promise<LengBase&TDB| undefined | null>
        delete(filter:Record<string, any>):EntitieRes<LengBase,TDB>
        readOne(filter?:Record<string,any>):EntitieRes<LengBase,TDB>
     }
