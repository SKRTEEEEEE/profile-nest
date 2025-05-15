// type DeleteByIdProps<TDB = TDBMockup> = {
//     id: TDB["id"];
// }
// type DeleteByIdRepository<TB, TDB = TDBMockup> = {
//     deleteById: (id: DeleteByIdProps<TDB>) => Promise<TB & TDB>; 
//     }
// type DeleteMeta<TB, TDB = TDBMockup, TFilter = Record<TB&TDB>, TOptions = TOptionsMockup> = {
//     filter: TFilter, options: TOptions
// }
// type DeleteProps<TB, TDeleteMeta extends DeleteMeta<TB>> = TDeleteMeta;
// type DeleteRepository<TB, TDeleteMeta> = {
//     delete: (props: DeleteProps<TB,TDeleteMeta>) => Promise<TB & TDB[]>;
//     }


type DeleteByIdProps<TDB> = TDB["id"]

type DeleteByIdRepository<TB, TDB> = {
    deleteById: (id: DeleteByIdProps<TDB>) => EntitieRes<TB, TDB>; 
}


type DeleteProps<TB, TDB> = {filter: Partial<TB & TDB>, options: Record}
type DeleteRepository<TB, TDB> = {
    delete: (props: DeleteProps<TB, TDB>) => EntitieArrayRes<TB, TDB>;
    }
