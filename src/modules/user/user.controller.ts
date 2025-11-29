import type { AppContext } from '@/app';
import { createUserSchema, updateUserSchema } from '@/modules/user/user.schema';
import { UserService } from '@/modules/user/user.service';
import { ResponseBuilder } from '@/core/http/response';
import { toUserPublicDto, toUserPublicList } from '@/modules/user/user.presenter';
import { Logger } from '@/utils/logger/logger';

export class UserController {
  private userService: UserService;
  private log: Logger;

  constructor({ userService, log }: { userService: UserService; log: Logger }) {
    this.userService = userService;
    this.log = log;
  }

  async getAll(c: AppContext) {
    const users = await this.userService.listUsers();
    const dto = toUserPublicList(users);
    return ResponseBuilder.Success({
      c,
      data: dto,
    });
  }

  async getById(c: AppContext) {
    const id = c.req.param('id');
    const user = await this.userService.getUserById(id);
    const dto = toUserPublicDto(user);
    return ResponseBuilder.Success({
      c,
      data: dto,
    });
  }

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

    const user = await this.userService.registerUser(parsed.data);
    const dto = toUserPublicDto(user);

    return ResponseBuilder.Success({
      c,
      data: dto,
      message: 'User created',
      status: 201,
    });
  }

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

    const user = await this.userService.updateUserProfile(id, parsed.data);
    const dto = toUserPublicDto(user);

    return ResponseBuilder.Success({
      c,
      data: dto,
      message: 'User updated',
    });
  }

  async delete(c: AppContext) {
    const id = c.req.param('id');

    await this.userService.deleteUser(id);
    return ResponseBuilder.Success({
      c,
      data: null,
      message: 'User deleted',
    });
  }
}
