import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gamesRepository: Repository<GameEntity>,
  ) {}

  async create(createGameDto) {
    const newGame = await this.gamesRepository.create(createGameDto);
    return await this.gamesRepository.save(newGame);
  }

  async findOne(id: string) {
    const game = await this.gamesRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });
    if (!game) {
      throw new HttpException('Game not found!', HttpStatus.NOT_FOUND);
    }
    const { id: authorId, email } = game.author;
    return {
      ...game,
      author: { id: authorId, email },
    };
  }

  async findAll() {
    return await this.gamesRepository.find();
  }
}
