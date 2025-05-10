export abstract class RoleRepository<
    TDBBase extends TDBBaseMockup,
    TUpdateByIdMeta extends UpdateByIdMeta<RoleBase>,
    TReadMeta extends ReadMeta<RoleBase>,
    TDeleteMeta extends DeleteMeta<RoleBase>

> implements
CRURepository<RoleBase, TDBBase, TUpdateByIdMeta>,
ReadRepository<RoleBase, TReadMeta>,
DeleteByIdRepository<RoleBase, TDBBase>,
DeleteRepository<RoleBase, TDeleteMeta> {
    abstract create(data: Omit<RoleBase, "id">): Promise<RoleBase & TDBBase>
    //readAll
    abstract read(): Promise<(RoleBase & TDBBase)[] | []>
    abstract readById: (id: TDBBase["id"]) => Promise<RoleBase & TDBBase>
    //updateRole
    abstract updateById(id: TDBBase["id"], role?:Partial<RoleBase>|undefined): Promise<RoleBase & TDBBase>
    abstract deleteById: (id: DeleteByIdProps<TDBBase>) => Promise<RoleBase & TDBBase>
    abstract delete: (props: DeleteProps<RoleBase, TDeleteMeta>) => Promise<RoleBase & TDBBase[]>
}
