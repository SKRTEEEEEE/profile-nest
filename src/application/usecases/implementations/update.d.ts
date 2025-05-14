// type UpdateMeta<
//     TB,
//     TDB = TDBMockup,
//     TFilter = Partial<TB & TDB>,
//     TUpdate = Partial<TB & TDB>,
//     TOptions = TOptionsMockup> = {
//     filter?: TFilter, 
//     updateData?: TUpdate, 
//     options?: TOptions 
// }
// type UpdateProps<TB, TUpdateMeta extends UpdateMeta<TB>> = TUpdateMeta

// type UpdateRepository<
// TB,
// TUpdateMeta extends UpdateMeta<TB>
// >
// = {
//     update: (props: UpdateProps<TB, TUpdateMeta>) => Promise<(TB & TDB)| null>;
// }

type UpdateProps <
TB, TDB
> = {filter: Partial<TB & TDB>, updateData: Partial<TB & TDB>}

type UpdateRepository<
TB, TDB
>
= {
    update: (props: UpdateProps<TB,TDB>) => EntitieArrayRes<TB, TDB>;
}