import { userRepository } from './user.repository'
import type { CreateUserInput, UpdateUserInput } from './user.schema'

export class UserNotFoundError extends Error {
  constructor() {
    super('User tidak ditemukan')
  }
}

export const userService = {
  async getAll() {
    return userRepository.findAll()
  },

  async getById(id: string) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  },

  async create(payload: CreateUserInput) {
    return userRepository.create(payload)
  },

  async update(id: string, payload: UpdateUserInput) {
    const existing = await userRepository.findById(id)
    if (!existing) {
      throw new UserNotFoundError()
    }
    return userRepository.update(id, payload)
  },

  async delete(id: string) {
    const existing = await userRepository.findById(id)
    if (!existing) {
      throw new UserNotFoundError()
    }
    await userRepository.delete(id)
  },
}
