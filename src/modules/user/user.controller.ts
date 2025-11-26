import type { AppContext } from '@/app';
import { createUserSchema, updateUserSchema } from '@/modules/user/user.schema';
import { userService } from '@/modules/user/user.service';
import { ResponseBuilder } from '@/core/http/response';
import { toUserPublicDto, toUserPublicList } from '@/modules/user/user.presenter';

export const userController = {
  async getAll(c: AppContext) {
    const users = await userService.listUsers();
    const dto = toUserPublicList(users);
    return ResponseBuilder.Success({
      c,
      data: dto,
    });
  },

  async getById(c: AppContext) {
    const id = c.req.param('id');
    const user = await userService.getUserById(id);
    const dto = toUserPublicDto(user);
    return ResponseBuilder.Success({
      c,
      data: dto,
    });
  },

  async create(c: AppContext) {
    const body = await c.req.json().catch(() => null);

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return ResponseBuilder.Error({
        c,
        message: 'Body tidak valid',
        status: 400,
        data: parsed.error.flatten(),
      });
    }

    const user = await userService.registerUser(parsed.data);
    const dto = toUserPublicDto(user);

    return ResponseBuilder.Success({
      c,
      data: dto,
      message: 'User created',
      status: 201,
    });
  },

  async update(c: AppContext) {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => null);

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return ResponseBuilder.Error({
        c,
        message: 'Body tidak valid',
        status: 400,
        data: parsed.error.flatten(),
      });
    }

    const user = await userService.updateUserProfile(id, parsed.data);
    const dto = toUserPublicDto(user);

    return ResponseBuilder.Success({
      c,
      data: dto,
      message: 'User updated',
    });
  },

  async delete(c: AppContext) {
    const id = c.req.param('id');

    await userService.deleteUser(id);
    return ResponseBuilder.Success({
      c,
      data: null,
      message: 'User deleted',
    });
  },
};
