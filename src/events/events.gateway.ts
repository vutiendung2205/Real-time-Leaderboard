import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventsService } from './events.service';

@WebSocketGateway()
export class EventsGateway implements OnModuleInit {
  constructor(private readonly eventsService: EventsService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('connected! ', socket.id);
    });
  }

  @SubscribeMessage('getHighScores')
  async getHighScores(@ConnectedSocket() client: any) {
    const highestScores = await this.eventsService.getHighScores();

    client.emit('getHighScores', highestScores);
  }

  @SubscribeMessage('getHightScoresGame')
  async getHighScoresGame(
    @ConnectedSocket() client: any,
    @MessageBody() gameId: string,
  ) {
    const highScoresGame = await this.eventsService.getHighScoresGame(gameId);
    client.emit('getHightScoresGame', highScoresGame);
  }
}
