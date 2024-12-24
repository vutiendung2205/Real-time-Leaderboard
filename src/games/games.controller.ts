import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthorizationGuard } from 'src/authorization/guards/jwt-authorization.guard';
import RequestWithUser from 'src/authorization/interfaces/requestWithUser-interface';
import { CreateGameDto } from './dto/create-game.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // create information of game
  @UseGuards(JwtAuthorizationGuard)
  @Post()
  create(@Request() request: RequestWithUser) {
    const { user, body } = request;
    const createGameDto: CreateGameDto = {
      ...body,
      author: user.id,
    };
    return this.gamesService.create(createGameDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }
}
