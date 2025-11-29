import { AppError } from '@/core/errors/app-error';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super({
      message: 'Invalid email or password',
      status: 401,
    });
    this.name = 'InvalidCredentialsError';
  }
}
