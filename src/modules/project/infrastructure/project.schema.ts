import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IntlBase } from '@skrteeeeee/profile-domain/dist/entities/intl.type';
import { TypeProject } from '@skrteeeeee/profile-domain/dist/entities/project.type';

// Sub-esquema para TechProject
@Schema({ _id: true })
export class TechProjectSchema {
  @Prop({ type: String, required: true })
  nameId: string;

  @Prop({ type: String, required: true })
  nameBadge: string;

  @Prop({ type: String, default: null })
  img: string | null;

  @Prop({ type: String, required: true })
  web: string;

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  desc: IntlBase;

  @Prop({ type: [String], required: true, enum: Object.values(TypeProject) })
  type: TypeProject[];

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  typeDesc: IntlBase;

  @Prop({ type: String, default: null })
  version: string | null;
}

export const TechProjectSchemaFactory = SchemaFactory.createForClass(TechProjectSchema);

// Sub-esquema para TimeProject
@Schema({ _id: true })
export class TimeProjectSchema {
  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  title: IntlBase;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  desc: IntlBase;

  @Prop({ type: [String], required: true, enum: Object.values(TypeProject) })
  type: TypeProject[];

  // 🔥 igual que antes: techs es un array de strings referenciando "projects"
  @Prop({ type: [String], ref: 'projects', required: true })
  techs: string[];
}

export const TimeProjectSchemaFactory = SchemaFactory.createForClass(TimeProjectSchema);

// Sub-esquema para KeyProject
@Schema({ _id: true })
export class KeyProjectSchema {
  @Prop({
    type: {
      iconName: { type: String, required: true },
      className: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  icon: {
    iconName: string;
    className: string;
  };

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  title: IntlBase;

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  desc: IntlBase;
}

export const KeyProjectSchemaFactory = SchemaFactory.createForClass(KeyProjectSchema);

// Esquema principal de Project
@Schema({ timestamps: true, collection: 'projects' })
export class ProjectSchemaDocument extends Document {
  @Prop({ type: String, required: true, unique: true })
  nameId: string;

  @Prop({ type: String, default: null })
  openSource: string | null;

  @Prop({ type: String, default: null })
  operative: string | null;

  @Prop({ type: Boolean, required: true, default: false })
  ejemplo: boolean;

  @Prop({ type: String, default: null })
  image: string | null;

  @Prop({ type: String, required: true })
  icon: string;

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  title: IntlBase;

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  desc: IntlBase;

  @Prop({
    type: {
      es: { type: String, required: true },
      en: { type: String, required: true },
      ca: { type: String, required: true },
      de: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  lilDesc: IntlBase;

  @Prop({ type: [TimeProjectSchema], default: [] })
  time: TimeProjectSchema[];

  @Prop({ type: [KeyProjectSchema], default: [] })
  keys: KeyProjectSchema[];

  @Prop({ type: [TechProjectSchema], default: [] })
  techs: TechProjectSchema[];
}

export const ProjectSchemaFactory = SchemaFactory.createForClass(ProjectSchemaDocument);

// Añadimos índice en techs.nameId para facilitar la búsqueda
ProjectSchemaFactory.index({ 'techs.nameId': 1 });
