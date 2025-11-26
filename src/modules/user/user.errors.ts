import { AppError } from '@/core/errors/app-error';

export class UserNotFoundError extends AppError {
  constructor(id?: string) {
    super({
      message: 'User tidak ditemukan',
      code: 'USER.NOT_FOUND',
      status: 404,
      meta: id ? { id } : undefined,
    });
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super({
      message: 'Email sudah terdaftar',
      code: 'USER.ALREADY_EXISTS',
      status: 409,
      meta: { email },
    });
  }
}
