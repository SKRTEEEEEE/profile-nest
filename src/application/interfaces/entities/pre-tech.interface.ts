

export abstract class PreTechRepository<
TDBBase> implements 
ReadRepository<PreTechBase, TDBBase>, 
PopulateRepository<PreTechBase, TDBBase>  {
    abstract updatePreTech(): Promise<void>;
    abstract readByQuery(query: string): Promise<(PreTechBase & TDBBase)[]>;
    abstract read(filter: ReadProps<PreTechBase, TDBBase>): Promise<(PreTechBase & TDBBase)[]>;
    abstract populate(docs: PopulateProps<PreTechBase>): Promise<(PreTechBase & TDBBase)[]>;
}