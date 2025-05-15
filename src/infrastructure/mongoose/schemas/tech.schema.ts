import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IntlSchema } from "./intl.schema";
import { FwBase, LengBase, LibBase } from "src/domain/entities/tech";



@Schema({ timestamps: true })
export class LibDocument extends Document 
implements LibBase
{
  @Prop({ required: true, minlength: 2 })
  nameId: string;

  @Prop({ required: true })
  nameBadge: string;

  @Prop({ required: true, match: /^[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}$/ })
  color: string;

  @Prop({ required: true })
  web: string;

  @Prop({ required: true, min: 1 })
  preferencia: number;

  @Prop({ required: true, min: 0, max: 100 })
  experiencia: number;

  @Prop({ required: true, min: 0, max: 100 })
  afinidad: number;

  @Prop({ default: null, match: /:\/\/(?:utfs\.io|[a-z0-9]+\.ufs\.sh)\/f\/([a-f0-9\-]+)-([a-z0-9]+)\.(jpg|webp|png)/ })
  img: string;

  @Prop({ type: Intl, required: true })
  desc: IntlSchema;

  @Prop({ required: true, min: 0, max: 100 })
  usoGithub: number;
}

@Schema({ timestamps: true })
export class FwDocument extends LibDocument 
implements FwBase
{
  @Prop({ type: [SchemaFactory.createForClass(LibDocument)] })
  librerias: LibDocument[];
}

@Schema({ timestamps: true })
export class LengDocument extends LibDocument
implements LengBase
{
  @Prop({ type: [SchemaFactory.createForClass(FwDocument)] })
  frameworks: FwDocument[];
}

export const LibSchema = SchemaFactory.createForClass(LibDocument);
export const FwSchema = SchemaFactory.createForClass(FwDocument);
export const LengSchema = SchemaFactory.createForClass(LengDocument);