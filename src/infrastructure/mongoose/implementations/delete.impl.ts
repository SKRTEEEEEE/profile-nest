import { MongooseDocument } from "../types";
import { MongooseDeleteByIdI, MongooseDeleteI, MongooseDeleteProps } from "../types/implementations";
import { MongooseBaseImpl } from "./base";

export class MongooseDeleteByIdImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseDeleteByIdI{
  async deleteById(id: string): Promise<boolean> {
    await this.connect();
    const result: TBase & MongooseDocument|null = await this.Model.findByIdAndDelete(id);
    return !!result;
  }
}
export class MongooseDeleteImpl<
TBase,
> extends MongooseBaseImpl<TBase> implements MongooseDeleteI<TBase>{
  async delete({filter, options}: MongooseDeleteProps<TBase>) {
    await this.connect();
    return await this.Model.findOneAndDelete(filter, options)
  }
}
