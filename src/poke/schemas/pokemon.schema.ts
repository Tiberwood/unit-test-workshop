import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<Pokemon>;

@Schema()
export class Pokemon {
  @Prop()
  name: string;
  @Prop()
  type: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
