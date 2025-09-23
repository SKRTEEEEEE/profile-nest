import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleBase } from 'src/domain/entities/role';
import { RoleType } from 'src/domain/entities/role.type';

@Schema({ timestamps: true, collection: 'Role' })
export class RoleSchemaDocument extends Document implements RoleBase {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: RoleType })
  permissions: RoleType;

  @Prop()
  stripeCustomerId?: string;

  @Prop()
  subscriptionId?: string;

  @Prop()
  subscriptionStatus?: string;
}
export const RoleSchemaFactory =
  SchemaFactory.createForClass(RoleSchemaDocument);
