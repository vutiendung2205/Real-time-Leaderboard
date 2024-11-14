import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  findOne(query: any): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: query });
  }

  isUserExisted(query: any) {
    return this.usersRepository.exists({ where: query });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  public getByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email } });
  }
}
