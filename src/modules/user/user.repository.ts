import { prisma } from '@/config/prisma';
import type { UserDomainProps } from '@/modules/user/user.domain';

export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(data: UserDomainProps) {
    return prisma.user.create({
      data,
    });
  },

  update(id: string, data: Partial<UserDomainProps>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
