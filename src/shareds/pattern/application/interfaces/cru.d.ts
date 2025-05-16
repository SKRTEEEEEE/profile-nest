// type UpdateByIdMeta<
// TB, 
// TDB = TDBMockup, 
// TUpdateQuery = Partial<TB & TDB>, 
// TOptions = any
// > = {
//     id: TDB["id"],
//     updateData: TUpdateQuery,
//     options: TOptions 
// }

// type UpdateByIdProps<TB, TUpdateByIdMeta extends UpdateByIdMeta<TB>
// > = TUpdateByIdMeta

// type CRUI
// <TB, TDB = TDBMockup, TUpdateByIdMeta extends UpdateByIdMeta<TB>>
// = {
//     create: (data: Omit<TB, 'id'>) => Promise <TB & TDB>,
//     readById: (id: TDB["id"]) => Promise<TB & TDB>,
//     updateById: (props: UpdateByIdProps<TB, TReadMeta>) => Promise<TB & TDB>
// }
type CreateRes<TB, TDB> = EntitieRes<TDB, TD>
type ReadByIdRes<TB, TDB> = EntitieRes<TB, TDB>;
type UpdateByIdRes<TB, TDB> = EntitieRes<TB, TDB>;

type CreateProps<T> = T
type ReadByIdProps<T> = T["id"]
type UpdateByIdProps<TB, TDB> = {id: TDB["id"], updateData: Partial<TB>}

type CRUI
<TB, TDB>
= {
    create: (data: Omit<TB, 'id'>) => CreateRes<TB, TDB>,
    readById: (id: ReadByIdProps<TDB>) => ReadByIdRes<TB, TDB>,
    updateById: (props: UpdateByIdProps<TB, TDB>) => UpdateByIdRes<TB, TDB>
}