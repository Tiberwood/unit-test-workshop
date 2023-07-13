import { Injectable } from '@nestjs/common';
import { CreatePokeDto } from './dto/create-poke.dto';
import { UpdatePokeDto } from './dto/update-poke.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from './schemas/pokemon.schema';

@Injectable()
export class PokeService {
  constructor(
    @InjectModel('Pokemon') private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async create(createPokeDto: CreatePokeDto) {
    try {
      const existingPokemon = await this.findByArgs({
        name: createPokeDto.name,
      });
      if (existingPokemon) {
        return existingPokemon;
      }
      const newPokemon = this.pokemonModel.create(createPokeDto);
      return newPokemon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll() {
    try {
      const url = `${this.configService.get<string>('BASE_URL')}/pokemon`;
      const response = await this.httpService.get(url);
      const result = await firstValueFrom(response);
      if (result.status !== 200) {
        throw new Error('Error fetching pokemon');
      }
      return result.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} poke`;
  }

  update(id: number, updatePokeDto: UpdatePokeDto) {
    return `This action updates a #${id} poke`;
  }

  remove(id: number) {
    return `This action removes a #${id} poke`;
  }

  async findByArgs(args: any) {
    const existingPokemon = await this.pokemonModel.findOne(args);
    return existingPokemon;
  }
}
