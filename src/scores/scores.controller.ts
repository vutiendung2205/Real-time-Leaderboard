import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthorizationGuard } from 'src/authorization/guards/jwt-authorization.guard';
import RequestWithUser from 'src/authorization/interfaces/requestWithUser-interface';
import { CreateScoreDto } from './dto/create-score.dto';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @UseGuards(JwtAuthorizationGuard)
  @Post()
  create(@Request() request: RequestWithUser) {
    const { user, body } = request;
    const createScoreDto: CreateScoreDto = body;
    if (!user.id) {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    return this.scoresService.create({
      ...createScoreDto,
      user: user.id,
    });
  }

  // @Get()
  // findAll() {
  //   return this.scoresService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.scoresService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
  //   return this.scoresService.update(+id, updateScoreDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.scoresService.remove(+id);
  // }
}
