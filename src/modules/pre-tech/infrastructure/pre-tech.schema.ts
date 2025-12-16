import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PreTechBase } from '@skrteeeeee/profile-domain/dist/entities/pre-tech';

@Schema({ timestamps: true, collection: 'ptechs' }) // 👈 aquí forzas el nombre
export class PreTechSchemaDocument extends Document implements PreTechBase {
  @Prop({ required: true, unique: true })
  nameId: string;

  @Prop({ required: true })
  nameBadge: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  web: string;
}

export const PreTechSchemaFactory = SchemaFactory.createForClass(
  PreTechSchemaDocument,
);
