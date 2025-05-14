// type ReadMeta<
//   TB,
//   TDB = TDBMockup,
//   TFilter = Partial<TB & TDB>,
//   TProjection = any,
//   TOptions = TOptionsMockup,
// > = {
//   filter?: TFilter;
//   projection?: TProjection;
//   options?: TOptions;
// };

// type ReadProps<TB, TReadMeta extends ReadMeta<TB>> = TReadMeta

// type ReadRepository<TB, TReadMeta extends ReadMeta<TB>> = {
//     read(props: ReadProps<TB, TReadMeta>): Promise<TB[]>;
// }
type ReadProps<TB, TDB> = Optional<Partial<TB & TDB>>
type ReadRepository<TB,TDB> = {
    read(filter: ReadProps<TB, TDB>): EntitieArrayRes<TB, TDB>;
}