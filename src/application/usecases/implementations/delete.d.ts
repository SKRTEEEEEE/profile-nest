// type DeleteByIdProps<TDBBase = TDBBaseMockup> = {
//     id: TDBBase["id"];
// }
// type DeleteByIdRepository<TBase, TDBBase = TDBBaseMockup> = {
//     deleteById: (id: DeleteByIdProps<TDBBase>) => Promise<TBase & TDBBase>; 
//     }
// type DeleteMeta<TBase, TDBBase = TDBBaseMockup, TFilter = Record<TBase&TDBBase>, TOptions = TOptionsMockup> = {
//     filter: TFilter, options: TOptions
// }
// type DeleteProps<TBase, TDeleteMeta extends DeleteMeta<TBase>> = TDeleteMeta;
// type DeleteRepository<TBase, TDeleteMeta> = {
//     delete: (props: DeleteProps<TBase,TDeleteMeta>) => Promise<TBase & TDBBase[]>;
//     }


type DeleteByIdProps<T> = T["id"]

type DeleteByIdRepository<TBase, TDBBase> = {
    deleteById: (id: DeleteByIdProps<TDBBase>) => Promise<TBase & TDBBase>; 
}


type DeleteProps<TBase, TDBBase> = {filter: Partial<TBase & TDBBase>, options: Record}
type DeleteRepository<TBase, TDBBase> = {
    delete: (props: DeleteProps<TBase, TDBBase>) => Promise<(TBase & TDBBase)[]>;
    }
