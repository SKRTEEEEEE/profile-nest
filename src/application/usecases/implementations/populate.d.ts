 type PopulateRepository<TBase, TDBBase = TDBBaseMockup> = {
    populate(
      docs: PopulateProps<TBase>,
    ): Promise<(TBase & TDBBase)[]>
  }
  type PopulateProps<TBase> = Array<TBase>