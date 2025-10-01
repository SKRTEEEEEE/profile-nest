type PopulateI<T> = {
  populate(docs: Array<T>): Promise<Array<T>>;
};
