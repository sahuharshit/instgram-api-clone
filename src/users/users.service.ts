import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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

  async login(req: Request, loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    // Constructs a payload object containing the user's information.
    const payload = {
      userID: user.id,
      username: user.username,
      user_email: user.email,
    };

    // Generates an authentication token using the payload object and returns it.
    const token = await this.generateAuthToken(payload);

    // add token in session entity

    return token;
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

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async decodeToken(token: string): Promise<any> {
    try {
      // Verify the token and extract the user ID and device name
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    // Find user with given email
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        "Invalid authentication credentials. Please double-check your information, sign up if you haven't already, and try again.",
      );
    }

    // Check if the password is valid
    const isValid = await bcrypt.compare(password, user.passwordHash);

    // If password is invalid, throw an UnauthorizedException
    // If user is valid and password is valid, delete the password field from user object and return it
    if (user && isValid) {
      delete user.passwordHash;
      return user;
    }

    // If user is not valid, return null
    return null;
  }

  /**
   * The function generates an authentication token using the user information and JWT configuration.
   * @param {any} user - The `user` parameter is an object that contains the information of the user
   * for whom the authentication token is being generated. This object typically includes properties
   * such as the user's ID, username, email, and any other relevant information needed for
   * authentication.
   * @returns a Promise that resolves to an authentication token.
   */
  async generateAuthToken(user: any): Promise<string> {
    const token = this.jwtService.sign(user, {
      expiresIn: process.env.JWT_EXPIRATION || '60s',
      secret: process.env.JWT_SECRET || 'secret',
    });
    return token;
  }
}
