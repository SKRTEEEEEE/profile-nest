type UpdateMeta<
    TBase,
    TDBBase = TDBBaseMockup,
    TFilter = Partial<TBase & TDBBase>,
    TUpdate = Partial<TBase & TDBBase>,
    TOptions = TOptionsMockup> = {
    filter?: TFilter, 
    updateData?: TUpdate, 
    options?: TOptions 
}
type UpdateProps<TBase, TUpdateMeta extends UpdateMeta<TBase>> = TUpdateMeta

type UpdateRepository<
TBase,
TUpdateMeta extends UpdateMeta<TBase>
>
= {
    update: (props: UpdateProps<TBase, TUpdateMeta>) => Promise<(TBase & TDBBase)| null>;
}