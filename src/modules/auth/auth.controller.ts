import type { Context } from 'hono';
import { AuthService } from './auth.service';
import { ResponseBuilder } from '@/core/http/response';
import { AppEnv } from '@/app';
import type { LoginInput } from '@/modules/auth/auth.schema';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (c: Context<AppEnv>) => {
    const body = c.req.valid('json' as never) as LoginInput;

    try {
      const result = await this.authService.login(body);
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
