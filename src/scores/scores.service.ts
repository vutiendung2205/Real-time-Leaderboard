import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScoreDto } from './dto/create-score.dto';
import { ScoreEntity } from './entities/score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(ScoreEntity)
    private readonly scoresRepository: Repository<ScoreEntity>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    const recordScore = await this.scoresRepository.findOne({
      where: {
        game: createScoreDto.gameId,
        user: createScoreDto.user,
      },
    });
    if (!recordScore) {
      const newScore = await this.scoresRepository.create(createScoreDto);
      return this.scoresRepository.save(newScore);
    } else {
      if (recordScore.points < createScoreDto.point) {
        // update new point
        return this.update(createScoreDto);
      }
    }
  }

  async update(createScoreDto: CreateScoreDto) {
    return await this.scoresRepository.update(
      { game: createScoreDto.gameId, user: createScoreDto.user },
      { points: createScoreDto.point },
    );
  }

  // findAll() {
  //   return `This action returns all scores`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} score`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} score`;
  // }
}
