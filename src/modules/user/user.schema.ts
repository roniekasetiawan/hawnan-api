import { z } from 'zod';
import type { User } from '@/generated/prisma/client';

export type UserCreateProps = Pick<User, 'email' | 'name'>;
export type UserUpdateProps = Partial<UserCreateProps>;

export type CreateUserInput = {
  email: User['email'];
  name?: User['name'];
};

export type UpdateUserInput = Partial<CreateUserInput>;

export const createUserSchema = z.object({
  email: z.email('Invalid email format'),
  name: z.string().max(100).nullable().optional(),
}) satisfies z.ZodType<CreateUserInput>;

export const updateUserSchema = createUserSchema.partial() satisfies z.ZodType<UpdateUserInput>;

export type CreateUserInputFromSchema = z.infer<typeof createUserSchema>;
export type UpdateUserInputFromSchema = z.infer<typeof updateUserSchema>;
