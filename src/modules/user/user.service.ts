import { UserRepository } from '@/modules/user/user.repository';
import type { CreateUserInput, UpdateUserInput } from '@/modules/user/user.schema';
import { UserAlreadyExistsError, UserNotFoundError } from '@/modules/user/user.errors';
import {
  applyUserProfileUpdate,
  buildNewUserProps,
  normalizeEmail,
} from '@/modules/user/user.domain';
import { Logger } from '@/utils/logger/logger';

export class UserService {
  private userRepository: UserRepository;
  private log: Logger;

  constructor({ userRepository, log }: { userRepository: UserRepository; log: Logger }) {
    this.userRepository = userRepository;
    this.log = log;
  }

  async listUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }

  async registerUser(input: CreateUserInput) {
    const props = buildNewUserProps(input);

    const existing = await this.userRepository.findByEmail(normalizeEmail(input.email));
    if (existing) {
      throw new UserAlreadyExistsError(input.email);
    }

    return this.userRepository.create(props);
  }

  async updateUserProfile(id: string, input: UpdateUserInput) {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new UserNotFoundError(id);
    }

    const currentProps = {
      email: existing.email,
      name: existing.name ?? null,
    };

    const nextProps = applyUserProfileUpdate(currentProps, input);

    if (nextProps.email !== currentProps.email) {
      const conflict = await this.userRepository.findByEmail(nextProps.email);
      if (conflict && conflict.id !== id) {
        throw new UserAlreadyExistsError(nextProps.email);
      }
    }

    return this.userRepository.update(id, nextProps);
  }

  async deleteUser(id: string) {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new UserNotFoundError(id);
    }

    await this.userRepository.delete(id);
  }
}
