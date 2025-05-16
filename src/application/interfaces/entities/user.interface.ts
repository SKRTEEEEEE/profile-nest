export abstract class UserRepository<
    TDBBase
>
implements 
    CRUI<UserBase, TDBBase>, 
    DeleteByIdI<UserBase, TDBBase>, 
    UpdateI<UserBase, TDBBase>, 
    ReadI<UserBase, TDBBase> 
{
    abstract create(data: CreateProps<UserBase>): CreateRes<UserBase, TDBBase>;
    abstract read(filter?: ReadProps<UserBase, TDBBase>): ReadRes<UserBase, TDBBase>;
    abstract readById(id: ReadByIdProps<TDBBase>): ReadByIdRes<UserBase, TDBBase>;
    abstract update(props: UpdateProps<UserBase, TDBBase>): UpdateRes<UserBase, TDBBase>;
    abstract updateById(props: UpdateByIdProps<UserBase, TDBBase>): UpdateByIdRes<UserBase, TDBBase>;
    abstract deleteById(id: DeleteByIdProps<TDBBase>): DeleteByIdRes<UserBase, TDBBase>;
    abstract readByAddress(address: string): Promise<UserBase&TDBBase>;
}