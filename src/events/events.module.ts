import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { ScoresModule } from 'src/scores/scores.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [GamesModule, ScoresModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
