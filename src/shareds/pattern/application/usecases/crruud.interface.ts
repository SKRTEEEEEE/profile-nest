export abstract class CRRUUDRepository <TB, TDB>
implements 
    CRUI<TB, TDB>,
    ReadI<TB, TDB>,
    UpdateI<TB, TDB>,
    DeleteI<TB, TDB> {
    
    abstract create(data: CreateProps<TB>): CreateRes<TB, TDB>;
    abstract read(filter?: ReadProps<TB, TDB>): ReadRes<TB, TDB>;
    abstract readById(id: ReadByIdProps<TDB>): ReadByIdRes<TB, TDB>;
    abstract update(props: UpdateProps<TB, TDB>): UpdateRes<TB, TDB>;
    abstract updateById(props: UpdateByIdProps<TB, TDB>): UpdateByIdRes<TB, TDB>;
    abstract delete(props: DeleteProps<TB, TDB>): DeleteRes<TB, TDB>;
}