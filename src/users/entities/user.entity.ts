import { GameEntity } from 'src/games/entities/game.entity';
import { ScoreEntity } from 'src/scores/entities/score.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    name: 'refresh_token',
    nullable: true,
  })
  public refreshToken?: string;

  @OneToMany(() => GameEntity, (game) => game.author)
  authoredGames: GameEntity[];

  @OneToMany(() => ScoreEntity, (score) => score.user)
  scores: ScoreEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
