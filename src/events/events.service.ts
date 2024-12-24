import { Injectable } from '@nestjs/common';
import { GamesService } from 'src/games/games.service';
import { ScoresService } from 'src/scores/scores.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly gamesServices: GamesService,
    private readonly scoreService: ScoresService,
  ) {}

  async getHighScores() {
    const games = await this.gamesServices.findAll();

    let highestScores = [];

    for (const game of games) {
      const highestScore = await this.scoreService.highestScore(game.id);

      if (highestScore) {
        highestScores = [
          ...highestScores,
          {
            ...game,
            highest: highestScore,
          },
        ];
      }
    }

    return highestScores;
  }

  async getHighScoresGame(gameId: string) {
    const highestScore = await this.scoreService.highestScore(gameId);
    return highestScore;
  }
}
