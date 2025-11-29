import { Hono } from 'hono';
import { AuthController } from '../auth.controller';
import type { AppEnv } from '@/app/index';

export class AuthRoute {
  public routes: Hono<AppEnv>;

  constructor(private readonly authController: AuthController) {
    this.routes = new Hono<AppEnv>();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.routes.post('/login', this.authController.login);
  }
}
