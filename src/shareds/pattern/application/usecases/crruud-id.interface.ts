export abstract class CRRUUDIdRepository<TB, TDB>
implements 
    CRUI<TB, TDB>,
    ReadI<TB, TDB>,
    UpdateI<TB, TDB>,
    DeleteByIdI<TB, TDB> {
    abstract create(data: CreateProps<TB>): CreateRes<TB, TDB>;
    abstract read(filter?: ReadProps<TB, TDB>): ReadRes<TB, TDB>;
    abstract readById(id: ReadByIdProps<TDB>): ReadByIdRes<TB, TDB>;
    abstract updateById(props: UpdateByIdProps<TB, TDB>): UpdateByIdRes<TB, TDB>;
    abstract update(props: UpdateProps<TB, TDB>): UpdateRes<TB, TDB>;
    abstract deleteById(id: DeleteByIdProps<TDB>): DeleteByIdRes<TB, TDB>;
    }