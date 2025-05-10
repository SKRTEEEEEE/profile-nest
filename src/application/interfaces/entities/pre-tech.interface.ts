

export abstract class PreTechRepository<
TDBBase, 
TReadMeta extends ReadMeta<PreTechBase>> implements ReadRepository<PreTechBase, TReadMeta>, PopulateRepository<PreTechBase, TDBBase>  {
    abstract updatePreTech(): Promise<void>;
    abstract readByQuery(query: string): Promise<(PreTechBase & TDBBase)[]>;
    abstract read(props: ReadProps<PreTechBase, TReadMeta>): Promise<(PreTechBase & TDBBase)[]>;
    abstract populate(docs: PopulateProps<PreTechBase>): Promise<(PreTechBase & TDBBase)[]>;
}