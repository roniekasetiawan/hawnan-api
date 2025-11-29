import { z } from 'zod';
import type { User } from '@/generated/prisma/client';

export type UserCreateProps = Pick<User, 'email' | 'name' | 'password'>;
export type UserUpdateProps = Partial<Omit<UserCreateProps, 'password'>>;

export type CreateUserInput = {
  email: User['email'];
  password: User['password'];
  name?: User['name'];
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>>;

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().max(100).nullable().optional(),
}) satisfies z.ZodType<CreateUserInput>;

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial() satisfies z.ZodType<UpdateUserInput>;

export type CreateUserInputFromSchema = z.infer<typeof createUserSchema>;
export type UpdateUserInputFromSchema = z.infer<typeof updateUserSchema>;
