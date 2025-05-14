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

// type CRURepository
// <TB, TDB = TDBMockup, TUpdateByIdMeta extends UpdateByIdMeta<TB>>
// = {
//     create: (data: Omit<TB, 'id'>) => Promise <TB & TDB>,
//     readById: (id: TDB["id"]) => Promise<TB & TDB>,
//     updateById: (props: UpdateByIdProps<TB, TReadMeta>) => Promise<TB & TDB>
// }
type CreateProps<T> = Omit<T, 'id'>
type ReadByIdProps<T> = T["id"]
type UpdateByIdProps<TB, TDB> = {id: TDB["id"], updateData: Partial<TB>}

type CRURepository
<TB, TDB>
= {
    create: (data: Omit<TB, 'id'>) => EntitieRes<TB, TDB>,
    readById: (id: ReadByIdProps<TDB>) => EntitieRes<TB, TDB>,
    updateById: (props: UpdateByIdProps<TB, TDB>) => EntitieRes<TB, TDB>
}