export abstract class UserRepository<
    TDBBase 
    > 
    implements CRURepository<UserBase,TDBBase>, 
    DeleteByIdRepository<UserBase, TDBBase>, UpdateRepository<UserBase, TDBBase>, ReadRepository<UserBase, TDBBase> 
    {
    abstract create(data: Omit<UserBase, 'id'>): Promise<UserBase & TDBBase>;
    abstract read(filter: ReadProps<UserBase, TDBBase>): Promise<(UserBase & TDBBase)[]>;
    abstract readById(id: ReadByIdProps<TDBBase>): Promise<UserBase & TDBBase>;
    abstract update(props: UpdateProps<UserBase, TDBBase>): Promise<UserBase & TDBBase>;
    abstract updateById(props: UpdateByIdProps<UserBase, TDBBase>): Promise<UserBase & TDBBase>;
    abstract deleteById(props: DeleteByIdProps< TDBBase>): Promise<UserBase & TDBBase>;
    // Esta función se añade sin utilizar las 'implementaciones' (mongoose), pero en el repositorio de mongoose se utilizará el método .findOne() -> Comprobar la flexibilidad de la arch 
    abstract readByAddress(address: string): Promise<UserBase & TDBBase>;
}