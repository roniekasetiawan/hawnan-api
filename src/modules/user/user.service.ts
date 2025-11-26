import { userRepository } from '@/modules/user/user.repository';
import type { CreateUserInput, UpdateUserInput } from '@/modules/user/user.schema';
import { UserAlreadyExistsError, UserNotFoundError } from '@/modules/user/user.errors';
import {
  applyUserProfileUpdate,
  buildNewUserProps,
  normalizeEmail,
} from '@/modules/user/user.domain';

export const userService = {
  async listUsers() {
    return userRepository.findAll();
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  },

  async registerUser(input: CreateUserInput) {
    const props = buildNewUserProps(input);

    const existing = await userRepository.findByEmail(normalizeEmail(input.email));
    if (existing) {
      throw new UserAlreadyExistsError(input.email);
    }

    return userRepository.create(props);
  },

  async updateUserProfile(id: string, input: UpdateUserInput) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new UserNotFoundError(id);
    }

    const currentProps = {
      email: existing.email,
      name: existing.name ?? null,
    };

    const nextProps = applyUserProfileUpdate(currentProps, input);

    if (nextProps.email !== currentProps.email) {
      const conflict = await userRepository.findByEmail(nextProps.email);
      if (conflict && conflict.id !== id) {
        throw new UserAlreadyExistsError(nextProps.email);
      }
    }

    return userRepository.update(id, nextProps);
  },

  async deleteUser(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new UserNotFoundError(id);
    }

    await userRepository.delete(id);
  },
};
