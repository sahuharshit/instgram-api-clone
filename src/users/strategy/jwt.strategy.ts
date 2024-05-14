import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Provider } from '../../enum/enum';
import { UsersService } from '../users.service';
import { ILocalLoginPayload } from 'src/interface/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, Provider.Jwt) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  /**
   *
   * @param {ILocalLoginPayload} payload - The authentication token payload to be validated.
   * @returns {Promise<ILocalLoginPayload>} - Returns a promise that resolves to the validated payload object.
   * @throws {UnauthorizedException} - Throws an UnauthorizedException if no user is found with the provided userId.
   *
   */
  async validate(payload: ILocalLoginPayload): Promise<ILocalLoginPayload> {
    // This if statement checks if the userID property is missing or falsy in the payload object.
    if (!payload.userID) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const user = await this.userService.findOne(payload.userID);
    if (!user) {
      throw new NotFoundException('the user does not exist');
    }

    return payload;
  }
}
