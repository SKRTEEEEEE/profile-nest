import { DBBase } from "@/dynamic.types";



type DeleteProps<T> = { filter: Partial<T & DBBase>; options?: Record };

type DeleteByIdI<T> = {
  deleteById: (id: string) => Promise<T & DBBase>;
};

type DeleteI<T> = {
  delete: (props: DeleteProps<T>) =>Promise<Array<T & DBBase>>;
};
