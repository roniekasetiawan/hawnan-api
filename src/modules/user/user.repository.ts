import { prisma } from '../../config/prisma'
import type { CreateUserInput, UpdateUserInput } from './user.schema'

export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  },

  create(data: CreateUserInput) {
    return prisma.user.create({
      data,
    })
  },

  update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
    })
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  },
}
