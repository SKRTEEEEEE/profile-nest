type ReadMeta<
  TBase,
  TDBBase = TDBBaseMockup,
  TFilter = Partial<TBase & TDBBase>,
  TProjection = any,
  TOptions = TOptionsMockup,
> = {
  filter?: TFilter;
  projection?: TProjection;
  options?: TOptions;
};

type ReadProps<TBase, TReadMeta extends ReadMeta<TBase>> = TReadMeta

type ReadRepository<TBase, TReadMeta extends ReadMeta<TBase>> = {
    read(props: ReadProps<TBase, TReadMeta>): Promise<TBase[]>;
}