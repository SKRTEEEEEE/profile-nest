import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RoleType } from 'src/domain/entities/role.type';
import { RoleSchemaDocument } from 'src/modules/role/infrastructure/role.schema';



@Schema({ timestamps: true, collection: "users" })
export class UserDocument extends Document {
  @Prop({ required: true })
  address: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', default: null })
  roleId: RoleSchemaDocument | null;

  @Prop({ type: String, enum: RoleType, default: null })
  role: RoleType | null;

  @Prop({ type: String, enum: RoleType, default: null })
  solicitud: RoleType | null;

  @Prop({ type: String, default: null })
  img: string | null;

  @Prop({ type: String, default: null })
  email: string | null;

  @Prop({type: String, default: null})
  nick: string | null;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop()
  verifyToken?: string;

  @Prop()
  verifyTokenExpire?: Date;

  @Prop()
  paymentId?: string;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserDocument);