import { JwtModule } from '@nestjs/jwt';

export const JWTModule = JwtModule.register({
  secret: process.env.JWT_SECRET || 'secret',
  signOptions: { expiresIn: '60s' },
});
