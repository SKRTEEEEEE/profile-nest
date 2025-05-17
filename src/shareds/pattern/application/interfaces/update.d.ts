type UpdateRes<TB, TDB> = EntitieRes<TB, TDB>;

type UpdateProps<TB, TDB> = {
    filter: Partial<TB & TDB>|Record<string|any>;
    update: Partial<TB & TDB>|Record<string, any>;
    options:Record<string, any>;
};

type UpdateI<TB, TDB> = {
    update: (props: UpdateProps<TB, TDB>) => UpdateRes<TB, TDB>;
};