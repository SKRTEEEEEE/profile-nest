type DeleteByIdProps<TDBBase = TDBBaseMockup> = {
    id: TDBBase["id"];
}
type DeleteByIdRepository<TBase, TDBBase = TDBBaseMockup> = {
    deleteById: (id: DeleteByIdProps<TDBBase>) => Promise<TBase & TDBBase>; 
    }
type DeleteMeta<TBase, TDBBase = TDBBaseMockup, TFilter = Record<TBase&TDBBase>, TOptions = TOptionsMockup> = {
    filter: TFilter, options: TOptions
}
type DeleteProps<TBase, TDeleteMeta extends DeleteMeta<TBase>> = TDeleteMeta;
type DeleteRepository<TBase, TDeleteMeta> = {
    delete: (props: DeleteProps<TBase,TDeleteMeta>) => Promise<TBase & TDBBase[]>;
    }