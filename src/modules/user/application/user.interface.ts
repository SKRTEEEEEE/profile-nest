export interface UserInterface<
    TDB
>
extends 
    CRUI<UserBase, TDB>{
     read(filter?: Partial <UserBase&TDB>): EntitieArrayRes<UserBase, TDB>;
     update(filter:Record<string,any>, options: Record<string,any> ): EntitieRes<UserBase,TDB> 
     deleteById(id: DeleteByIdProps<TDB>): DeleteByIdRes<UserBase, TDB>;
    readByAddress(address: string): Promise<UserBase&TDB>;
    readOne(filter: Record<string, any>): EntitieRes<UserBase,TDB>
}