import { Test, TestingModule } from '@nestjs/testing';
import { PokeService } from './poke.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import pokeData from './test-data/poke.data';
import { getModelToken } from '@nestjs/mongoose';

describe('PokeService', () => {
  let service: PokeService;
  let configService: ConfigService;
  const mockHttpService = {
    get: jest.fn(),
  };
  const mockPokemonModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokeService,
        ConfigService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: getModelToken('Pokemon'), useValue: mockPokemonModel },
      ],
    }).compile();

    service = module.get<PokeService>(PokeService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pokemon', async () => {
      jest.spyOn(configService, 'get').mockImplementation((value) => {
        switch (value) {
          case 'BASE_URL':
            return 'https://pokeapi.co/api/v2';
        }
      });
      jest.spyOn(mockHttpService, 'get').mockImplementation(() => {
        return new Observable((subs) => {
          subs.next({
            data: pokeData.VALID_FIND_ALL_RESPONSE(),
            status: 200,
            statusText: 'OK',
            headers: undefined,
            config: undefined,
          });
          subs.complete();
        });
      });
      const result = await service.findAll();
      expect(result).toEqual(pokeData.VALID_FIND_ALL_RESPONSE());
      expect(configService.get).toBeCalledWith('BASE_URL');
      expect(mockHttpService.get).toBeCalledWith(
        'https://pokeapi.co/api/v2/pokemon',
      );
    });
    it('should throw an error if the response is not 200', async () => {
      jest.spyOn(configService, 'get').mockImplementation((value) => {
        switch (value) {
          case 'BASE_URL':
            return 'https://pokeapi.co/api/v2';
        }
      });
      jest.spyOn(mockHttpService, 'get').mockImplementation(() => {
        return new Observable((subs) => {
          subs.next({
            data: {},
            status: 500,
            statusText: 'Error',
            headers: undefined,
            config: undefined,
          });
          subs.complete();
        });
      });
      try {
        await service.findAll();
      } catch (error) {
        expect(error.message).toEqual('Error fetching pokemon');
      }
      expect(configService.get).toBeCalledWith('BASE_URL');
      expect(mockHttpService.get).toBeCalledWith(
        'https://pokeapi.co/api/v2/pokemon',
      );
    });
  });
  describe('create', () => {
    it('should create a new pokemon', async () => {
      jest
        .spyOn(mockPokemonModel, 'findOne')
        .mockImplementation(() => undefined);
      jest.spyOn(mockPokemonModel, 'create').mockImplementation((data) => data);
      const result = await service.create(
        pokeData.VALID_POKEMON('bulbasaur', 'grass'),
      );
      console.log(result);
      expect(result.name).toEqual('bulbasaur');
      expect(result.type).toEqual('grass');
      expect(mockPokemonModel.findOne).toBeCalledWith({
        name: 'bulbasaur',
      });
      expect(mockPokemonModel.create).toBeCalledWith({
        name: 'bulbasaur',
        type: 'grass',
      });
    });
    it('should return an existing pokemon if it already exists', async () => {
      jest.spyOn(mockPokemonModel, 'findOne').mockImplementation((args) => {
        if (args.name === 'bulbasaur') {
          return pokeData.VALID_POKEMON('bulbasaur', 'grass');
        }
      });
      const result = await service.create(
        pokeData.VALID_POKEMON('bulbasaur', 'grass'),
      );
      expect(result.name).toEqual('bulbasaur');
      expect(result.type).toEqual('grass');
      expect(mockPokemonModel.findOne).toBeCalledWith({
        name: 'bulbasaur',
      });
    });
    it('should throw an error if there is an error', async () => {
      jest.spyOn(mockPokemonModel, 'findOne').mockImplementation(() => {
        throw new Error('Error');
      });
      try {
        await service.create(pokeData.VALID_POKEMON('bulbasaur', 'grass'));
      } catch (error) {
        expect(error.message).toEqual('Error');
      }
      expect(mockPokemonModel.findOne).toBeCalledWith({
        name: 'bulbasaur',
      });
    });
  });
});
