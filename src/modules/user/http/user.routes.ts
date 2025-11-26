import { Hono } from 'hono';
import type { AppEnv } from '@/app';
import { userController } from '@/modules/user/user.controller';

export const userRoutes = new Hono<AppEnv>();

userRoutes.get('/', c => userController.getAll(c));
userRoutes.get('/:id', c => userController.getById(c));
userRoutes.post('/', c => userController.create(c));
userRoutes.put('/:id', c => userController.update(c));
userRoutes.delete('/:id', c => userController.delete(c));
