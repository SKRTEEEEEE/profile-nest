// type ReadMeta<
//   TBase,
//   TDBBase = TDBBaseMockup,
//   TFilter = Partial<TBase & TDBBase>,
//   TProjection = any,
//   TOptions = TOptionsMockup,
// > = {
//   filter?: TFilter;
//   projection?: TProjection;
//   options?: TOptions;
// };

// type ReadProps<TBase, TReadMeta extends ReadMeta<TBase>> = TReadMeta

// type ReadRepository<TBase, TReadMeta extends ReadMeta<TBase>> = {
//     read(props: ReadProps<TBase, TReadMeta>): Promise<TBase[]>;
// }
type ReadProps<TBase, TDBBase> = Optional<Partial<TBase & TDBBase>>
type ReadRepository<TBase,TDBBase> = {
    read(filter: ReadProps<TBase, TDBBase>): Promise<(TBase & TDBBase)[]>;
}