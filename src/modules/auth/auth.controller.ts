import type { Context } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { ResponseBuilder } from '@/core/http/response';
import { AppEnv } from '@/app';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (c: Context<AppEnv>) => {
    const body = await c.req.json();
    const validator = zValidator('json', loginSchema);
    const validationResult = await validator.validate(c, () => {});

    if (validationResult.ok === false) {
      return ResponseBuilder.Error({
        c,
        message: 'Invalid request body',
        data: validationResult.error.flatten(),
        status: 400,
      });
    }

    const { email, password } = body;

    try {
      const result = await this.authService.login({ email, password });
      return ResponseBuilder.Success({
        c,
        data: result,
        message: 'Login successful',
      });
    } catch (err) {
      // The service throws specific errors, but we catch any others too.
      return ResponseBuilder.Error({ c, message: 'Invalid email or password', status: 401 });
    }
  };
}
