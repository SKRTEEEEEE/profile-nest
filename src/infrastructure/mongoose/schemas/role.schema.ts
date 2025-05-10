import { Prop, Schema } from "@nestjs/mongoose";

@Schema({timestamps:true, collection: 'Role'})
export class RoleSchemaDocument extends Document implements RoleBase {
    @Prop({required:true})
    address: string;

    @Prop({required:true, enum: RoleType})
    permissions: RoleType;

    @Prop()
  stripeCustomerId?: string;

  @Prop()
  subscriptionId?: string;

  @Prop()
  subscriptionStatus?: string;
}