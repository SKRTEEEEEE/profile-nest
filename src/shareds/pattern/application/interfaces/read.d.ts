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

// type ReadI<TB, TReadMeta extends ReadMeta<TB>> = {
//     read(props: ReadProps<TB, TReadMeta>): Promise<TB[]>;
// }
type ReadRes<TB, TDB> = EntitieArrayRes<TB,TDB>
type ReadProps<TB, TDB> = {
    filter: Optional<Partial<TB & TDB>> , 
    projection: Optional<string | AnyObject>,
    options: Optional<undefined | null | AnyObject>
} | {}
type ReadI<TB,TDB> = {
    read(filter: ReadProps<TB, TDB>): EntitieArrayRes<TB, TDB>;
}