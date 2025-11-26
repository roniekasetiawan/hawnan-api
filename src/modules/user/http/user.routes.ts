import { Hono } from 'hono'
import { userController } from '../user.controller'

export const userRoutes = new Hono()

userRoutes.get('/', (c) => userController.getAll(c))
userRoutes.get('/:id', (c) => userController.getById(c))
userRoutes.post('/', (c) => userController.create(c))
userRoutes.patch('/:id', (c) => userController.update(c))
userRoutes.delete('/:id', (c) => userController.delete(c))
