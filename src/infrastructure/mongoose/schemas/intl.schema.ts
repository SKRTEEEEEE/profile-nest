import { Prop, Schema } from "@nestjs/mongoose";
import { IntlBase } from "src/domain/entities/intl";

@Schema()
export class IntlSchema implements IntlBase{
  @Prop({ required: true, minlength: 2 })
  es: string;

  @Prop({ required: true, minlength: 2 })
  en: string;

  @Prop({ required: true, minlength: 2 })
  ca: string;

  @Prop({ required: true, minlength: 2 })
  de: string;
}