
import { DBBase } from "src/dynamic.types";




type CreateProps<T> = Partial<T>;
type UpdateByIdProps<T> = { id: string; updateData: Partial<T> };

type CRUI<T> = {
  create: (data: CreateProps) => Promise<T & DBBase>;
  readById: (id: string) => Promise<T & DBBase>;
  updateById: (props: UpdateByIdProps<T>) => Promise<T & DBBase>;
};
