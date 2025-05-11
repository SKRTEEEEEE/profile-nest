import { RoleBase } from "src/domain/entities/role";

export abstract class RoleRepository<
    TDBBase
> implements
    CRURepository<RoleBase, TDBBase>,
    ReadRepository<RoleBase, TDBBase>,
    DeleteByIdRepository<RoleBase, TDBBase>,
    DeleteRepository<RoleBase, TDBBase> {
    abstract create(data: Omit<RoleBase, "id">): Promise<RoleBase & TDBBase>
    abstract read(props?: ReadProps<RoleBase, TDBBase>): Promise<(RoleBase & TDBBase)[] | []>
    abstract readById(id: ReadByIdProps<TDBBase>): Promise<RoleBase & TDBBase | null>
    abstract updateById(props: UpdateByIdProps<RoleBase,TDBBase>): Promise<RoleBase & TDBBase | null>
    abstract deleteById(props: DeleteByIdProps<TDBBase>): Promise<RoleBase & TDBBase>
    abstract delete(props: DeleteProps<RoleBase, TDBBase>): Promise<(RoleBase & TDBBase)[]>
}
