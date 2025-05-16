type PopulateRes<TB, TDB> = EntitieArrayRes<TB, TDB>;

type PopulateProps<TB> = Array<TB>;

type PopulateI<TB, TDB> = {
    populate(docs: PopulateProps<TB>): PopulateRes<TB, TDB>;
};