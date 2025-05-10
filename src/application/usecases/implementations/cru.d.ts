type UpdateByIdMeta<
TBase, 
TDBBase = TDBBaseMockup, 
TUpdateQuery = Partial<TBase & TDBBase>, 
TOptions = any
> = {
    id: TDBBase["id"],
    updateData: TUpdateQuery,
    options: TOptions 
}

type UpdateByIdProps<TBase, TUpdateByIdMeta extends UpdateByIdMeta<TBase>
> = TUpdateByIdMeta

type CRURepository
<TBase, TDBBase = TDBBaseMockup, TUpdateByIdMeta extends UpdateByIdMeta<TBase>>
= {
    create: (data: Omit<TBase, 'id'>) => Promise <TBase & TDBBase>,
    readById: (id: TDBBase["id"]) => Promise<TBase & TDBBase>,
    updateById: (props: UpdateByIdProps<TBase, TReadMeta>) => Promise<TBase & TDBBase>
}