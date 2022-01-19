import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop([String])
  tags: string[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  // owner: Owner;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
  // owner: Owner[];

  @Prop(
    raw({
      firstName: { type: String },
      lastName: { type: String },
    }),
  )
  details: Record<string, any>;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
