type DeleteByIdRes<TB, TDB> = EntitieRes<TB, TDB>;
type DeleteRes<TB, TDB> = EntitieRes<TB, TDB>;

type DeleteByIdProps<TDB> = TDB['id'];
type DeleteProps<TB, TDB> = { filter: Partial<TB & TDB>; options?: Record };

type DeleteByIdI<TB, TDB> = {
  deleteById: (id: DeleteByIdProps<TDB>) => DeleteByIdRes<TB, TDB>;
};

type DeleteI<TB, TDB> = {
  delete: (props: DeleteProps<TB, TDB>) => DeleteRes<TB, TDB>;
};
