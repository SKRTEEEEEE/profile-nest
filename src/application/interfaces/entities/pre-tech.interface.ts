

export abstract class PreTechRepository<
TDB> implements 
ReadRepository<PreTechBase, TDB>, 
PopulateRepository<PreTechBase, TDB>  {
    abstract updatePreTech(): Promise<void>;
    abstract readByQuery(query: string): Promise<(PreTechBase & TDB)[]>;
    abstract read(filter: ReadProps<PreTechBase, TDB>): Promise<(PreTechBase & TDB)[]>;
    abstract populate(docs: PopulateProps<PreTechBase>): Promise<(PreTechBase & TDB)[]>;
}