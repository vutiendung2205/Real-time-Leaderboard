import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty()
  @IsString()
  game: string;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsOptional()
  user?: string;
}
