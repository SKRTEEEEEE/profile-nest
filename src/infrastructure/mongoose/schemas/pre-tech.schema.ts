import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PreTechBase } from "src/domain/entities/pre-tech";

@Schema({ timestamps: true, collection: 'ptechs' }) // 👈 aquí forzas el nombre
export class PreTechSchema implements PreTechBase {
  @Prop({ required: true, unique: true })
  nameId: string;

  @Prop({ required: true })
  nameBadge: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  web: string;
}

export const preTechSchemaFactory = SchemaFactory.createForClass(PreTechSchema);