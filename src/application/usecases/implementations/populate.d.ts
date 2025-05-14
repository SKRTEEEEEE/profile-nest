


type PopulateProps<TB> = Array<TB>

type PopulateRepository<TB, TDB> = {
    populate(
      docs: PopulateProps<TB>,
    ): EntitieArrayRes<TB, TDB>;
  }