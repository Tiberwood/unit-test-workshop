import { Test, TestingModule } from '@nestjs/testing';
import { PokeController } from './poke.controller';
import { PokeService } from './poke.service';

describe('PokeController', () => {
  let controller: PokeController;
  const mockPokeService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokeController],
      providers: [
        PokeService,
        { provide: PokeService, useValue: mockPokeService },
      ],
    }).compile();

    controller = module.get<PokeController>(PokeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should return a pokemon', async () => {
      const mockCreatePokemonDto = {
        name: 'pikachu',
        type: 'electric',
      };
      const mockResponse = {
        name: 'pikachu',
        type: 'electric',
      };
      jest
        .spyOn(mockPokeService, 'create')
        .mockImplementation(() => Promise.resolve(mockResponse));
      const result = await controller.create(mockCreatePokemonDto);
      expect(result).toEqual(mockResponse);
      expect(mockPokeService.create).toBeCalledWith(mockCreatePokemonDto);
    });
    it('should return a pokemon if it already exists', async () => {
      const mockCreatePokemonDto = {
        name: 'pikachu',
        type: 'electric',
      };
      const mockResponse = {
        name: 'pikachu',
        type: 'electric',
      };
      jest
        .spyOn(mockPokeService, 'create')
        .mockImplementation(() => Promise.resolve(mockResponse));
      const result = await controller.create(mockCreatePokemonDto);
      expect(result).toEqual(mockResponse);
      expect(mockPokeService.create).toBeCalledWith(mockCreatePokemonDto);
    });
    it('should throw an error if the pokemon cannot be created', async () => {
      const mockCreatePokemonDto = {
        name: 'pikachu',
        type: 'electric',
      };
      jest
        .spyOn(mockPokeService, 'create')
        .mockImplementation(() => Promise.reject('Error'));
      try {
        await controller.create(mockCreatePokemonDto);
      } catch (error) {
        expect(error).toEqual('Error');
      }
      expect(mockPokeService.create).toBeCalledWith(mockCreatePokemonDto);
    });
  });
});
