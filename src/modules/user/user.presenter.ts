import type { User } from '@/generated/prisma/client';

export type UserPublicDto = {
  id: string;
  email: string;
  name: string | null;
};

export function toUserPublicDto(user: User): UserPublicDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export function toUserPublicList(users: User[]): UserPublicDto[] {
  return users.map(toUserPublicDto);
}
