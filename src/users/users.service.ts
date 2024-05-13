import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.ensureUserDoesNotExist(createUserDto);
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.createUser(createUserDto, hashedPassword);
  }

  private async ensureUserDoesNotExist(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    const userExists = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  private async createUser(
    createUserDto: CreateUserDto,
    hashedPassword: string,
  ): Promise<User> {
    const newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: any): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    // Placeholder for now @TODO create a method to remove a user
    return `This action removes a #${id} user`;
  }
}
