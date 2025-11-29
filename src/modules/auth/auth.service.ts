import { UserRepository } from '@/modules/user/user.repository';
import type { LoginInput } from './auth.schema';
import { InvalidCredentialsError } from './auth.errors';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { normalizeEmail } from '../user/user.domain';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
  ) {}

  async login(input: LoginInput) {
    const email = normalizeEmail(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: ['user'], // Assuming a default role for now
      exp: Math.floor(Date.now() / 1000) + parseInt(this.jwtExpiresIn, 10),
    };

    const token = await sign(payload, this.jwtSecret);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
