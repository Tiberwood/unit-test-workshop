import { PartialType } from '@nestjs/mapped-types';
import { CreatePokeDto } from './create-poke.dto';

export class UpdatePokeDto extends PartialType(CreatePokeDto) {}
