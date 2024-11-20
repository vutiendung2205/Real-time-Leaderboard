import { GameEntity } from 'src/games/entities/game.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'scores' })
export class ScoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => GameEntity, (game) => game.scores)
  game: string;

  @Column()
  points: number;

  @ManyToOne((type) => UserEntity, (user) => user.id)
  user: string;

  @CreateDateColumn()
  createdAt: Date;
}
