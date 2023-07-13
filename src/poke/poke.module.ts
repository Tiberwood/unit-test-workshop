import { Module } from '@nestjs/common';
import { PokeService } from './poke.service';
import { PokeController } from './poke.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PokemonSchema } from './schemas/pokemon.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'Pokemon',
        schema: PokemonSchema,
      },
    ]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [PokeController],
  providers: [PokeService],
})
export class PokeModule {}
