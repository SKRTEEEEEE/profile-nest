export abstract class UserRepository<
    TDBBase extends TDBBaseMockup, 
    TUpdateByIdMeta extends UpdateByIdMeta<UserBase>, 
    TUpdateMeta extends UpdateMeta<UserBase>, 
    TReadMeta extends ReadMeta<UserBase>
    > 
    implements CRURepository<UserBase,TDBBase, TUpdateByIdMeta>, 
    DeleteByIdRepository<UserBase, TDBBase>, UpdateRepository<UserBase, TUpdateMeta>, ReadRepository<UserBase, TReadMeta> 
    {
    abstract create(data: Omit<UserBase, 'id'>): Promise<UserBase & TDBBase>;
    abstract read(props: ReadProps<UserBase, TReadMeta>): Promise<UserBase[]>;
    abstract readById(id: TDBBase["id"]): Promise<UserBase & TDBBase>;
    abstract update(props: UpdateProps<UserBase, TUpdateMeta>): Promise<UserBase>;
    abstract updateById(props: UpdateByIdProps<UserBase, TUpdateByIdMeta>): Promise<UserBase & TDBBase>;
    abstract deleteById(props: DeleteByIdProps< TDBBase>): Promise<UserBase & TDBBase>;
    // Esta función se añade sin utilizar las 'implementaciones' (mongoose), pero en el repositorio de mongoose se utilizará el método .findOne() -> Comprobar la flexibilidad de la arch 
    abstract readByAddress(address: string): Promise<UserBase & TDBBase>;
}