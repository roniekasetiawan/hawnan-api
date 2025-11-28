import { prisma } from '@/config/prisma';
import { PrismaClient } from '@/generated/prisma';
import type { UserDomainProps } from '@/modules/user/user.domain';

export class UserRepository {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  findAll() {
    return this.db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  create(data: UserDomainProps) {
    return this.db.user.create({
      data,
    });
  }

  update(id: string, data: Partial<UserDomainProps>) {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.db.user.delete({
      where: { id },
    });
  }
}
