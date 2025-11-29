import { Hono } from 'hono';
import type { AppEnv } from '@/app';
import { UserController } from '@/modules/user/user.controller';

export const userRoutes = new Hono<AppEnv>();

export class UserRoute {
  private userController: UserController;

  constructor({ userController }: { userController: UserController }) {
    this.userController = userController;
  }

  routes(): Hono<AppEnv> {
    const r = new Hono<AppEnv>();

    r.get('/', c => this.userController.getAll(c));
    r.get('/:id', c => this.userController.getById(c));
    r.post('/', c => this.userController.create(c));
    r.put('/:id', c => this.userController.update(c));
    r.delete('/:id', c => this.userController.delete(c));

    return r;
  }
}