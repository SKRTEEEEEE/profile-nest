


type PopulateProps<TBase> = Array<TBase>

type PopulateRepository<TBase, TDBBase> = {
    populate(
      docs: PopulateProps<TBase>,
    ): Promise<(TBase & TDBBase)[]>
  }