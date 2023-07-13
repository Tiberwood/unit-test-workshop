import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PokeService } from './poke.service';
import { CreatePokeDto } from './dto/create-poke.dto';
import { UpdatePokeDto } from './dto/update-poke.dto';

@Controller('poke')
export class PokeController {
  constructor(private readonly pokeService: PokeService) {}

  @Post('create')
  create(@Body() createPokeDto: CreatePokeDto) {
    return this.pokeService.create(createPokeDto);
  }

  @Get('list')
  findAll() {
    return this.pokeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokeDto: UpdatePokeDto) {
    return this.pokeService.update(+id, updatePokeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokeService.remove(+id);
  }
}
